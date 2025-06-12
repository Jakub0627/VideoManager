# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including ts-node as a local dev dep)
RUN npm install

# Install ts-node and typescript globally so "npm start" works --- w teorii to jest fix problemów
RUN npm install -g ts-node typescript

# Copy the rest of the app
COPY . .

# Cloud Run requires listening on this port
EXPOSE 8080

# Start app using ts-node
CMD ["npm", "start"]