# Quantiphi_CafeNextDoor

# Create a new project and ( && ) move into it.
mkdir dialogflow-food-agent-server && cd dialogflow-food-agent-server

# Create a new Node project
yarn init -y

# Install needed packages
yarn add mongodb @google-cloud/functions-framework dotenv

After installing above packages, we modify the generated package.json file to include two new objects which enable us to run a cloud function locally.

// package.json
{
  "main": "index.js",
  "scripts": {
    "start": "functions-framework --target=foodFunction --port=8000"
  },
}

The start command in the scripts tells the Framework to run the foodFunction in the 'index.js' file and also makes it listen and serve connections through our localhost on port 8000.

we can start the function locally by running yarn start from the command line in the project’s directory. But we still cannot make use of the running function as Dialogflow only supports secure connections with an SSL certificate

Using Ngrok, we can create a tunnel to expose the localhost port running the cloud function to the internet with an SSL certificate

ngrok http -bind-tls=true 8000 [-bind-tls=true argument is what instructs Ngrok to create a secured tunnel rather than the unsecured connection]


Chatbot DEMO is shown already
Demo details like presentation and screenshots of BOT responses are present in repository.
