# Group Chat with Web Socket

This is a mini-project for Computer Networking Assignment 3.

## Running the Application

### Option 1: Visit the Deployed Web App

- The app is deployed on Google Cloud
- Visit [https://group-chat-656496851753.asia-northeast1.run.app](https://group-chat-656496851753.asia-northeast1.run.app) for live demo

### Option 2: Load Docker Image from DockerHub and Run on Local Machine

1. Make sure your local machine has docker installed.
2. Pull the Docker Image of this Image from DockerHub.

   I dockerized this project and registered at DockerHub. Pull the image on your local machine.

   `docker pull parkjumyung/group-chat:1.0`

3. Run the Docker Image

   `docker run -p 3000:3000 parkjumyung/group-chat:1.0`

4. Open a browser and visit [http://localhost:3000](http://localhost:3000/)

### Option 3: Load the Compressed Docker Image and Run on Local Machine

1. Make sure your local machine has docker installed.
2. Download the attached `group-chat.tar` file and open a terminal on the directory where the file is in.
3. Load the Docker Image from `group-chat.tar`

   `docker load --input group-chat.tar`

4. Run the Docker Image

   `docker run -p 3000:3000 parkjumyung/group-chat:1.0`

5. Open a browser and visit [http://localhost:3000](http://localhost:3000/)

### Option 4: Build and Run the Docker Image From the Source Code and Run on Local Machine

1. Make sure your local machine has docker installed.
2. Open a terminal in the directory of the source code.
3. Build Docker Image from the source code.

   `docker build --tag parkjumyung/group-chat:1.0 .`

4. Run the Docker Image

   `docker run -p 3000:3000 parkjumyung/group-chat:1.0`

5. Open a browser and visit [http://localhost:3000](http://localhost:3000/)
