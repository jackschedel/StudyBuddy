# Base image
FROM node:20-alpine3.17

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to work directory
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . ./

# Expose port 3000 for the app
EXPOSE 3000

# Start the app
CMD [ "yarn", "start" ]
