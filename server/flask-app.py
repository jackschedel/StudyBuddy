from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging
import hashlib
import PyPDF2
import openai
import pandas as pd
import tiktoken
from uuid import uuid4
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chat_models import ChatOpenAI
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.chains import RetrievalQA
from langchain.agents import Tool
from langchain.agents import initialize_agent
from tqdm.auto import tqdm
import pinecone


logging.basicConfig(filename='app.log', level=logging.DEBUG, format='%(asctime)s:%(levelname)s:%(message)s')

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
PINECONE_ENV = "northamerica-northeast1-gcp"
tokenizer = tiktoken.get_encoding('cl100k_base')

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'mp4'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_type(file_path):
    return os.path.splitext(file_path)[1].lower()

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text_data = {}
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text_data[page_num + 1] = page.extract_text()
    return text_data

def extract_text_from_mp4(mp4_path):
    with open(mp4_path, "rb") as audio_file:
        response = openai.Audio.transcribe("whisper-1", audio_file)
    return {1: response['text']}  # This assumes each MP4 results in one chunk of text

def extract_text(filepath):
    file_type = get_file_type(filepath)
    if file_type == ".pdf":
        return extract_text_from_pdf(filepath)
    elif file_type == ".mp4":
        return extract_text_from_mp4(filepath)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)

            # Extract text from the file
            extracted_text = extract_text(filepath)

            # Transform extracted text to JSONL format
            jsonl_data = transform_to_jsonl(extracted_text)

            # Tokenize the JSONL data
            tokenized_data = tokenize_text(jsonl_data)

            # Upload tokenized data to Pinecone
            upload_to_pinecone(tokenized_data)

            os.remove(filepath)
            logging.info(f"File {file.filename} processed and uploaded to Pinecone successfully.")
            return jsonify({"message": "Uploaded successfully!"}), 200

        else:
            logging.warning(f"Attempted upload of unsupported file type: {file.filename}")
            return jsonify({"error": "File type not allowed"}), 400

    except ValueError as ve:
        logging.error(f"Error processing file {file.filename}: {ve}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logging.error(f"Unexpected error processing file {file.filename}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


def transform_to_jsonl(text_data):
    docs = []
    for page_num, content in text_data.items():
        entry = {
            "id": str(page_num),
            "source": "Page " + str(page_num),
            "page_content": content.replace("\n", " ")
        }
        docs.append(entry)
    return docs

def tiktoken_len(text):
    tokens = tokenizer.encode(text, disallowed_special=())
    return len(tokens)

tiktoken.encoding_for_model('gpt-3.5-turbo')

def tokenize_text(docs):
    token_counts = [tiktoken_len(doc['page_content']) for doc in docs]

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=10,
        length_function=tiktoken_len,
        separators=['\n\n', '\n', ' ', '']
    )

    m = hashlib.md5()  # this will convert source into a unique ID

    documents = []
    for doc in tqdm(docs):
        source = doc['source']
        m.update(source.encode('utf-8'))
        uid = m.hexdigest()[:12]
        chunks = text_splitter.split_text(doc['page_content'])
        for i, chunk in enumerate(chunks):
            documents.append({
                'id': f'{uid}-{i}',
                'text': chunk
            })
    return pd.DataFrame(documents)

index_name = 'rag-testing'

def initialize_pinecone():
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)
    if index_name not in pinecone.list_indexes():
        pinecone.create_index(
            name=index_name,
            metric='dotproduct',
            dimension=1536  # 1536 dim of text-embedding-ada-002
        )

embed = OpenAIEmbeddings(model='text-embedding-ada-002', openai_api_key=OPENAI_API_KEY)

def upload_to_pinecone(df):
    try:
        index = pinecone.Index(index_name)
        batch_size = 100
        texts = []
        metadatas = []
        for i in tqdm(range(0, len(df), batch_size)):
            i_end = min(len(df), i+batch_size)
            batch = df.iloc[i:i_end]
            metadatas = [{'text': record['text']} for _, record in batch.iterrows()]
            documents = batch['text']
            embeds = embed.embed_documents(documents)
            embeds = list(embeds)  # Ensure it's in the right format
            ids = batch['id'].astype(str)
            index.upsert(vectors=zip(ids, embeds, metadatas))
        logging.info(f"Uploaded data to Pinecone successfully.")

    except Exception as e:
        logging.error(f"Error uploading to Pinecone: {e}")
        raise

initialize_pinecone()

text_field = "text"
index = pinecone.Index(index_name)
vectorstore = Pinecone(index, embed.embed_query, text_field)
llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    model_name='gpt-3.5-turbo',
    temperature=0.0
)
conversational_memory = ConversationBufferWindowMemory(
    memory_key='chat_history',
    k=5,
    return_messages=True
)
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)
tools = [
    Tool(
        name='Knowledge Base',
        func=qa.run,
        description=(
            'use this tool when answering general knowledge queries to get '
            'more information about sylabuses, lectures, assignments, and course information'
        )
    )
]
agent = initialize_agent(
    agent='chat-conversational-react-description',
    tools=tools,
    llm=llm,
    verbose=True,
    max_iterations=3,
    early_stopping_method='generate',
    memory=conversational_memory
)

# [New Endpoint for Agent]
@app.route('/query_agent', methods=['POST'])
def query_agent():
    try:
        data = request.json
        query = data.get("query", "")
        response = agent(query)
        return jsonify({"response": response})
    except Exception as e:
        logging.error(f"Error querying agent: {e}")
        return jsonify({"error": "An unexpected error occurred querying the agent"}), 500

if __name__ == '__main__':
    try:
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        app.run(debug=True, port=3001, threaded=False)
    except Exception as e:
        logging.error(f"Error initializing the app: {e}")
        raise

@app.route('/uflproxy/<path:subpath>', methods=['GET', 'POST'])
def proxy(subpath):
    url = 'https://ufl.instructure.com/' + subpath

    app.logger.info(f'Request URL: {url}')

    headers = {key: value for (key, value) in request.headers if key != 'Host'}
    
    if request.method == 'GET':
        response = requests.get(url, params=request.args, headers=headers)
    elif request.method == 'POST':
        response = requests.post(url, json=request.get_json(), headers=headers)
        
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(port=5000)