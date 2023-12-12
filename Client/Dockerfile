# Use the official Node.js 14 LTS image as the base image
FROM node:lts-slim

# Install yarn globally
# RUN npm install -g yarn

# Set the working directory in the container
WORKDIR /usr/src/client

# Copy package.json and package-lock.json to the working directory
COPY Client/package.json Client/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all files from the client folder to the working directory
COPY Client ./

# Build the React app (if necessary)
RUN yarn build

# Expose the port the React app runs on
EXPOSE 5173

# Define the command to start the React app
CMD ["npm", "run", "dev"]