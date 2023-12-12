# Use the official Node.js 14 LTS image as the base image
FROM node:lts-slim

# Install yarn globally
# RUN npm install -g yarn

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json to the working directory
COPY Server/package.json Server/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all files from the server folder to the working directory
COPY Server ./

# Expose the port the Node.js server runs on
EXPOSE 8000

# Define the command to start the Node.js server
CMD ["node", "index.js"]