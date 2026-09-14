---
title: "Parsing Application logs using parseable"
subtitle: "Create a quick node.js application which will generate logs and will be captured and logged using parseable."
date: 2024-04-08T06:43:49.580Z
slug: parsing-application-logs-using-parseable
---

![](https://substack-post-media.s3.amazonaws.com/public/images/b17259e6-4fd5-4650-971e-0c109ada5770_2240x1260.png)

Application logs are essential for monitoring your app's health and quickly resolving issues when your application encounters problems. While JavaScript and Node.js developers can utilize libraries like Logger and Morgan to manage logs, there may be scenarios where you need more detailed insights and an efficient way to store and access these logs.

Enter **[Parseable](https://www.parseable.com/)**, an open-source, cloud-native and log analytics platform built for performance and resource efficiency. It's an ideal solution for scenarios requiring complete data ownership, alongside stringent security and privacy measures.

In this guide, we'll explore how to create a simple Node.js application and leverage Parseable to enhance our log analytics capabilities for more effective monitoring and troubleshooting. Join us as we delve into the world of advanced log management with Parseable.

## #1 Getting Started with Parseable

Parseable is an open-source platform that can be easily set up on your local machine, provided you have Docker installed.

### Prerequisites:

- **Docker** `v25.0` **Installed**: To install Docker on your operating system, follow this guide: [Docker Installation Guide](https://www.knowledgehut.com/blog/devops/docker-installation)

After installing Docker, you can verify the installation by checking its version. Open your terminal and enter the following command:

```
docker --version
```

You should see an output similar to this:

```
Docker version 25.0.2, build 29cf629
```

With Docker installed and the correct version verified, you're now ready to install the Parseable Docker image!

### Installing Parseable Docker:

To install the Parseable Docker image, follow these steps:

1. Open your terminal.

2. Type the following command:

```
docker run -p 8000:8000 \
  parseable/parseable:latest \
  parseable local-store
```

After running this command successfully, you will be able to access the Parseable dashboard at <http://localhost:8000>. Log in to the dashboard using the default credentials: **Username**: `admin`, **Password**: `admin`.

If your container is running well, the next step is to build our node.js application.

## #2 Building the Node.js Application to send logs

Let’s create our node.js application. Before proceeding, make sure you have node.js installed in your system.

To install node.js, follow this guide: https://kinsta.com/blog/how-to-install-node-js/

#### **Step 1: Initialize a New Node.js Project**

First, you'll need to have Node.js installed on your computer. Once you have Node.js and npm (Node Package Manager) installed, you can initialize a new Node.js project by running the following commands in your terminal or command prompt:

```
mkdir parseable-nodejs-demo 
cd parseable-nodejs-demo
npm init -y
```

This will create a new directory named `parseable-nodejs-demo`, navigate into it, and initialize a new Node.js project with default settings.

This will create a new directory named `parseable-nodejs-demo`, navigate into it, and initialize a new Node.js project with default settings.

#### **Step 2: Create the Application Script**

Next, create a new file named `app.js` in the `parseable-nodejs-demo` directory. Open this file in your preferred text editor or IDE, and paste [this code](https://github.com/thecoderpanda/parseable-nodejs-demo/blob/main/index.js).

This script generates a new dummy log entry every 5 seconds and appends it to a file named `dummy.log` in the same directory as the script. Each log entry includes a timestamp and a dummy message.

#### **Step 3: Run the Application**

Finally, run the application by executing the following command in the terminal or command prompt while in the `dparseable-nodejs-demo` directory:

```
node app.js
```

The application will start, and you should see messages being logged to the console and the `dummy.log` file every 5 seconds.

You can stop the application at any time by pressing `Ctrl + C` in the terminal or command prompt.

## #3 Creating Parseable log Stream:

First, we need to set up a log stream. This is a one-time task, and it's best to group log entries with the same format into a single log stream. For instance, consider creating one log stream for each application, assuming all logs from that application follow the same structure.

To implement the parseable log stream into our existing application, open the index.js file created in the previous step and paste the following code accordingly:

```
var myHeaders = new Headers();
// TODO: Replace the basic auth credentials with your Parseable credentials
myHeaders.append("Authorization", "Basic YWRtaW46YWRtaW4=");

var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow'
};
// Replace the url with your Parseable URL and stream name
fetch("https://<parseable-url>/api/v1/logstream/<stream-name>", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
```

In the code snippet, replace `parseable-url` with the URL of your locally hosted Parseable instance, which in this case is `https://localhost:8000`.

To run the application, open your terminal and enter the following command:

```
node index.js
```

After running the Node.js application, you should see your stream displayed on the dashboard.

![](https://substack-post-media.s3.amazonaws.com/public/images/29710e8c-c12d-4cad-a609-8e46f20a4d12_2940x644.png)

For the final step, we'll send some log streams to Parseable.

Open the `index.js` file we created earlier, and let's update our code so it sends logs to the Parseable dashboard every 5 seconds.

```
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'dummy.log');

function generateLogMessage() {
  const timestamp = new Date().toISOString();
  const message = `Log entry at ${timestamp}: This is a dummy log message.`;
  return message;
}

function appendLogMessage() {
  const message = generateLogMessage() + '\n';
  fs.appendFile(logFilePath, message, (err) => {
    if (err) {
      console.error('Error appending to log file:', err);
    } else {
      console.log('Log message added:', message.trim());
      sendLogToParseable(message); // Call to send the log to Parseable
    }
  });
}

// Function to send log message to Parseable
function sendLogToParseable(logMessage) {
  const myHeaders = new Headers();
  myHeaders.append("X-P-META-Host", "192.168.1.3");
  myHeaders.append("X-P-TAG-Language", "javascript");
  myHeaders.append("Authorization", "Basic YWRtaW46YWRtaW4="); // Replace with your Parseable credentials
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify([{
    "message": logMessage, // Use the log message here
    "datetime": new Date().toISOString(),
  }]);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Replace <parseable-url> and <stream-name> with your actual Parseable URL and stream name
  fetch("http://localhost:8000/api/v1/logstream/demoapp", requestOptions)
    .then(response => response.text())
    .then(result => console.log('Log sent to Parseable:', result))
    .catch(error => console.log('error sending log to Parseable:', error));
}

const intervalMs = 5000;
setInterval(appendLogMessage, intervalMs);
```

After updating the code, our boilerplate setup will send a basic log message to Parseable, allowing us to view the ingested logs.

Let's run our **index.js** file again to observe the logs being ingested on the Parseable dashboard.

With these modifications, our code will now send a sample log to the Parseable dashboard every 5 seconds. Here's what our dashboard will display:

![](https://substack-post-media.s3.amazonaws.com/public/images/63663e09-93de-4bca-91cf-ebff2903d3ec_2940x1168.png)

And there you have it! You've successfully navigated the process of setting up Parseable with Docker, creating a Node.js application to generate logs, and finally, configuring your application to send these logs to the Parseable dashboard in real-time.

We encourage you to experiment further with Parseable and explore its full range of features. The insights gained from effective log analysis can significantly improve your application's performance, security, and user experience.

Feel free to share your experiences, challenges, or any cool insights you've gained from using Parseable in your projects.

Remember, every log tells a story, and with Parseable, you're the author. Keep exploring, keep innovating, and most importantly, keep parsing!
