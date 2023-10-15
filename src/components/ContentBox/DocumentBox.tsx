import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { ContextDocument, DocumentType } from "@src/types";
import { Document, Page, pdfjs } from "react-pdf";
import { uploadFromUrl } from "../../api/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentBox = () => {
  const { contextDocument, setContextDocument, setDocText, docText } = useAppContext();
  const [numPages, setNumPages] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!contextDocument)
      return;

    const isHtml = contextDocument.url.startsWith("http://localhost:") && contextDocument.url.endsWith(".html");

    console.log(contextDocument)

    if(isHtml) {
      setDocText(contextDocument.text);

      if(contextDocument.name === "Quiz 01") {
        setDocText(`Question 1\n5 / 5 pts\nAccording to the video on Mycenae and Knossos, which answer(s) is/are correct?\nCorrect!\nAll the answers are correct.\nLocated in the Mino Palace second floor is a grand space called the Piano Nobile.\nThe people who lived inside the buildings in the citadel were of high status, consisting of military, administrative, and religious sectors.\nThe iconic Lion Gate was the entrance to Agamemnon’s citadel, which consists of two lions standing on either side of a column.\n\nQuestion 2\n5 / 5 pts\nAccording to Professor Tilson’s lecture on Greece, a new landscape plan around the Acropolis constructed of discarded stone and representing many time periods of history was created by contemporary architect\nCorrect!\nDimitris Pikionis\nFrank Gehry\nTadao Ando\nBernard Tschumi\n\nQuestion 3\n5 / 5 pts\nAccording to Professor Tilson’s lecture on Greece, an aerial view of the acropolis showing the route of the Panathenaic Way clearly marks the century’s old path.  From this view, it is obvious that the path\nwas organized along a strict axis\nleads to a radial focal point\nCorrect!\nfollows the line of the topography\ncreates a zig-zag pattern through the city\n\nQuestion 4\n5 / 5 pts\nA trilithon at Stonehenge consists of:\na vertical sighting stone and two horizontal stones.\nCorrect!\ntwo upright stones capped by a lintel.\nthree concentric rings of ditches.\nthree coffin-sized stone slabs used as an altar.\nNone of the answers is correct.\n\nQuestion 5\n5 / 5 pts\nThe designer of the first pyramid for Djoser's funerary complex was:\nSenmut.\nNone of the answers is correct.\nCorrect!\nImhotep.\nAlexander the Great.\nDjoser.\n\nQuestion 6\n0 / 5 pts\nAccording to Professor Tilson’s lecture on Egypt, the pyramid visualizes the emergence of\nCorrect Answer\nthe primordial mountain from the seas\na gilded capstone\na circular earth mound\nYou Answered\nobelisk\n\nQuestion 7\n5 / 5 pts\nAccording to Professor Tilson’s lecture on Mesopotamia, Bronze Age Mesopotamia (including Sumer, Akkadian, Babylonian and Assyrian empires) was known as\nSumerian\nBabylonia\nthe Western Front\nCorrect!\nthe Fertile Crescent\n\nQuestion 8\n0 / 5 pts\nThe Temple of Hera, shown here in the photograph below and built around 550 BCE in Southern Italy, is an example of a:\n\nTemple of Hera.jpg\n\nPalace complex.\nYou Answered\nMegaron.\nCorinthian colonade.\nCorrect Answer\nDoric temple.\nDomos and Prodomos.\n\nQuestion 9\n0 / 5 pts\nMinoan columns are unusual because the shafts:\nwere painted with frescoes.\nCorrect Answer\ntaper downward.\nare triangulated.\nmimic bundles of reeds.\nYou Answered\nAll of the answers are correct.`);
      }

      if(contextDocument.name === "Quiz 03") {
        setDocText(`Question 1\n5 / 5 pts\nMalwiya Minaret.png\nAccording to the video on The Addasids Samarra, what does the conical structure, shown in the image above, represent in Islamic architecture?\niwan\nCorrect!\nminaret\nharam\nsahn\nQuestion 2\n5 / 5 pts\nAccording to Professor Kara’s lecture on Islamic architecture, while mosques were the center of religion, they also served other functions of society to include:\nhigher education.\ncemetery.\nCorrect!\nall of the answers are correct.\nmarkets.\nQuestion 3\n0 / 5 pts\nAccording to the video on Isfahan the Royal Mosque, The high porches of the iwans, the deep set arcades, the void between the two vaults of the dome, and the central pool all combine to\nYou Answered\nmake an area for prayer.\nprovide a place for ritual cleansing.\ncreate a place for religious teaching.\nCorrect Answer\ncreate air, shade, and coolness.\nQuestion 4\n5 / 5 pts\nThe octagonal structure, seen in the image below, is:\nDome of the Rock.jpg\nthe Alhambra.\nCorrect!\nthe Dome of the Rock.\nthe Great Mosque in Cordoba.\nthe Sehzade Mosque.\nthe the Great Mosque of al-Mutawakkil.\nQuestion 5\n5 / 5 pts\nTracing back to the Mesopotamian ziggurats, the Great Mosque of al-Mutawakkil in Samarra is notable for its:\nminarets made of stone imported from Africa.\nminarets with tombs in their bases.\nCorrect!\nspiral minaret.\nmultiple octagonal minarets.\nlack of minarets.\nQuestion 6\n5 / 5 pts\nAccording to the video on Saint Mark’s Basilica, the church is a______plan and the walls are covered in 40,000 square feet of ______ displaying Christian scenes of  ______ figures in  Middle Byzantine style.\ncentral, marble mosaics, greek\nroman cross, brick mosaics, greek\nlatin cross, glass mosaics, roman\nCorrect!\ngreek cross, gold mosaics, attenuated symbolic\nQuestion 7\n5 / 5 pts\nAccording to the video on Hagia Sophia, which of the following is/are architectural feature(s) of the church?\ndome\ngold mosaics\nCorrect!\nAll the answers are correct\npendentives\npiers\nQuestion 8\n5 / 5 pts\nAccording to Professor Kara’s lecture on Early Christian and Byzantine architecture, the interior and exterior of the early Roman basilica\nwere similar in style to express continuity within the church\nwere derived from early Chinese religious buildings\nwere considered inappropriate for the era\nCorrect!\nwere dramatically different in style with the inside elaborately adorned with decoration and the outside simple and austere\nQuestion 9\n5 / 5 pts\nThe quincunx plan is composed of nine bays making a:\nlarge rectangle.\nlarge circle.\nCorrect!\nlarge square.\nlinear arrangement.\nasymmetrical cross.\nQuestion 10\n5 / 5 pts\nThe Russian church seen in the image below is:\nSt Basil the Blessed.png\nChurch of the Transfiguration\nCorrect!\nChurch of St. Basil the Blessed\nHagia Sophia\nSan Vitale in Ravenna\nChurch of the Raising of Lazarus\nQuestion 11\n5 / 5 pts\nAccording to Professor Tilson’s lecture on Rome, the precursor to the Italian Piazza, the Spanish Plaza and North American Square was the\nmarket\nCorrect!\nforum\nround-table\nbazaar\nQuestion 12\n5 / 5 pts\nAccording to Professor Tilson’s lecture on Rome, the Pantheon was designed to contain a\n“perfect square”\n“perfect circle”\nCorrect!\n“perfect sphere”\n“perfect cone”\nQuestion 13\n5 / 5 pts\nMarcus Vitruvius Pollio, commonly known as Vitruvius, wrote:\nCorrect!\nThe Ten Books of Architecture.\na history of the Etruscans.\nThe Architecture of the Roman Republic.\na biography of Julius Caesar.\na history of ancient Rome.\nQuestion 14\n5 / 5 pts\nThe main north-south and the east-west streets in a Roman castra are called the:\ncaesaro and the imperius, respectively.\nforo and the saturnalia, respectively.\netrusco and the romanus, respectively.\nCorrect!\ncardo and the decumanus, respectively.\nNone of the answers is correct.\nQuestion 15\n0 / 5 pts\nWall paintings in a room in the Villa of the Mysteries at Pompeii relate to the:\nCorrect Answer\nmystical cult of Bacchus.\nhistory of Rome.\npractice of Early Christianity.\nYou Answered\nspiritual and religious practices of its inhabitants.\neruption of Mount Vesuvius.`);
      }

    }

  }, [contextDocument]);

  useEffect(() => {
    console.log("Document Text: ", docText);
  }, [docText]);

  if (!contextDocument) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        <h1 className="text-2xl">No Document Selected</h1>
      </div>
    );
  }

  const isPdf =
    contextDocument.url.startsWith("http://localhost:") && contextDocument.url.endsWith(".pdf");

    const isHtml =
    contextDocument.url.startsWith("http://localhost:") && contextDocument.url.endsWith(".html");


    async function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
      setNumPages(numPages);
      if (contextDocument) {
          pdfjs.getDocument(contextDocument.url).promise.then(pdf => {
              let text = "";
              for(let i = 1; i <= numPages; i++) {
                  pdf.getPage(i).then(page => {
                      page.getTextContent().then(textContent => {
                          for(let item of textContent.items) {
                              if ('str' in item) {
                                  text += item.str + " ";
                              }
                          }
                          setText(text);
                          setDocText(text);
                      });
                  });
              }
          });
      }
  }


  async function callFetchData() {
    if (
      contextDocument?.url &&
      !contextDocument.url.startsWith("http://127.0.0.1")
    ) {
      try {
        const data = await uploadFromUrl(contextDocument.url);
        console.log(data);
        let newUrl = data.pdf_url.replace('http://localhost', 'http://127.0.0.1');
        setContextDocument({ ...contextDocument, url: newUrl });
      } catch (error) {
        console.log("Fetch Error:", error);
      }
    }
  }

  return (
<div className="w-full h-full bg-gray-100 flex flex-col justify-start items-center text-black p-2">
      <h1 className="text-4xl pt-1 pb-2">{contextDocument.name}</h1>
      <div className="flex justify-center items-center w-full h-full overflow-hidden">
        {isPdf ? (
          <div className="w-full h-full overflow-hidden relative">
            <Document
              file={contextDocument.url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="self-center w-full h-full overflow-auto"
            >
              {Array.from(new Array(numPages), (el, index) => [
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="absolute left-1/2 transform -translate-x-1/2"
                  scale={0.7}
                />,
                numPages > 1 && index < numPages - 1 ? (
                  <div className="h-2" key={`divider_${index + 1}`}></div>
                ) : null,
              ]).reduce((prev, curr) => prev.concat(curr), [])}
            </Document>
          </div>
        ) : isHtml ? (
          <iframe
            src={contextDocument.url}
            className="self-center w-full h-full overflow-auto"
          />
        ) : (
          <p className="self-center overflow-auto">
            ContextDocumentURL: {contextDocument.url}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentBox;
