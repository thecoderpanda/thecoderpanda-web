---
title: "How to Configure Kafka Metrics in SigNoz for Your Node.js Application: A Step-by-Step Tutorial"
date: 2024-04-06T14:47:25.387Z
slug: how-to-configure-kafka-metrics-in
---

![](https://substack-post-media.s3.amazonaws.com/public/images/69e82b5b-7843-40b9-9f45-ab3159a996bc_2240x1260.png)

In today's data-centric landscape, comprehending the behaviour of your applications and services is crucial. Observability platforms like **SigNoz** are pivotal in providing essential insights into your applications and aiding in making informed decisions.

This guide will take you through setting up an OpenTelemetry receiver and transmitting Kafka metrics data to SigNoz using Node.js.

The integration of Kafka with SigNoz empowers you to monitor critical metrics of your Kafka instance, including brokers, topics, consumers, and producers. Such metrics are vital for ensuring the optimal performance of your Kafka clusters and can assist in pinpointing bottlenecks or issues within your data streaming pipelines.

Before we dive deep into the setup process, let's briefly touch upon some key concepts that will lay the foundation for our journey ahead!

## What is Observability?

Observability measures how well an application's internal states can be inferred from its external outputs. It goes beyond monitoring by alerting you when things go wrong and providing insights into why they went wrong. It encompasses metrics, traces, and logs - the three pillars that offer comprehensive visibility into system performance and behaviour.

## Introduction to Apache Kafka and SigNoz

Apache Kafka is a distributed event streaming platform capable of handling trillions of events a day. Initially conceived as a messaging queue, Kafka is based on an abstraction of a distributed commit log. It enables applications to publish, subscribe to, store, and process streams of records in real-time.

SigNoz is an open-source observability platform that helps you monitor applications and troubleshoot problems in your applications. It leverages OpenTelemetry for instrumentation, making it a versatile choice for observing a wide range of technologies, including Apache Kafka and many more!

## Prerequisites

Before diving into the setup, ensure you have the following:

- An operational Apache Kafka cluster.
- A Node.js environment is set up, ideally with an application already producing or consuming Kafka events.
- SigNoz OSS or SigNoz Cloud.

## Getting Started:

### Step 1: Installing Apache Kafka Cluster.

Before you start installing Kafka, ensure that you have the following installed on your machine:

- Java 8 or higher: Kafka is written in Java, so you'll need the Java Runtime Environment (JRE) or Java Development Kit (JDK) installed.
- Zookeeper: Kafka uses Zookeeper for managing and coordinating Kafka brokers. It's typically included in Kafka downloads.

**Installing Kafka:**

Navigate to the official Apache Kafka website to download the latest version of Kafka. Choose the binary files suitable for your system.

Extract the downloaded archive to your desired location. This extracted directory will be referred to as your Kafka home directory (KAFKA\_HOME).

#### Starting the Kafka Environment

Apache Kafka requires Zookeeper to manage its cluster state and configurations. Thus, you need to start Zookeeper before starting Kafka.

**Start Zookeeper:**

Open a terminal window and navigate to your KAFKA\_HOME directory. Start Zookeeper by running:

```
bin/zookeeper-server-start.sh config/zookeeper.properties
```

**Start Kafka Broker:**

Open another terminal window. From the KAFKA\_HOME directory, start the Kafka broker by executing:

```
bin/kafka-server-start.sh config/server.properties
```

Congratulations! You now have a basic Kafka cluster running on your local machine. This cluster consists of a single Kafka broker and a Zookeeper instance, sufficient for development and testing purposes.

With your Kafka cluster up and running, you're now ready to move on to setting up OpenTelemetry to capture and forward Kafka metrics to SigNoz.

### Step 2: Create a Node.Js application to interact with Kafka.

In this section, we'll create a Node.js application that acts as an intermediary between your users and your Kafka cluster. This app will allow users to produce and consume messages using a simple API. At the heart of this application, we'll use KafkaJS, a modern and feature-rich library for working with Kafka in Node.js.

The application will have two main endpoints:

1. **POST /produce:** Users can send messages to a specific Kafka topic by making a POST request to this endpoint with a JSON payload containing the `topic` and the `message` they want to send.

2.  **GET /consume**: This endpoint will retrieve all the messages that have been consumed from the subscribed topic so far and return them to the user. It's a simple way to get messages for demonstration purposes.

When the app starts, it will create a Kafka producer and consumer. The consumer will subscribe to messages from the `'test-topic'` and log the value of each message to the console. The producer will be used in the `/produce` endpoint to send messages. The consumer will store incoming messages in a local array, which will be returned when the `/consume` endpoint is called.

To get started with this application:

- Make sure you have Node.js installed on your machine.
- Clone the repository with the complete application code from [GitHub](https://github.com/thecoderpanda/nodejs-kafka-signoz-demo)
- Go into the project directory and run `npm install` to install the required dependencies.
- Run *node app.js* to start the application. The server will start listening on port 3000, ready to interact with your Kafka cluster.

Once you run the application, you should see output in your terminal similar to the example provided. This example application gives you a basic idea of how to integrate Kafka with Node.js applications.

![](https://substack-post-media.s3.amazonaws.com/public/images/9553b2d7-fade-44a4-98c1-1f4044c74a21_1600x50.png)

### Step 3: Configure Project in SigNoz

To get started with SigNoz, you can either use the open-source version or the cloud version. In this tutorial, we'll use [SigNoz Cloud](https://signoz.io/teams/).

After signing up on SigNoz Cloud, you'll be prompted to get started. Click on "Application Monitoring" to begin.

![](https://substack-post-media.s3.amazonaws.com/public/images/8d9678fe-adab-46f2-81dc-8da52601a3fa_1600x623.png)

On the next screen, select **JavaScript** as the data source, name your service (in our case, we named it **Signoz\_kafka\_app**), and choose Express as the JavaScript framework.

![](https://substack-post-media.s3.amazonaws.com/public/images/10e66f1a-3bb5-4f4c-85df-23b67ea1d5a6_1600x577.png)

Next, select the environment. For this tutorial, we'll use **macOS ARM64**.

Then, we'll choose how our application will send the metrics. We'll use the **OpenTelemetry Collector** for better control over logs and metrics.

![](https://substack-post-media.s3.amazonaws.com/public/images/88e21848-f808-40f3-bac9-222568691ed4_1600x601.png)

Our next step is to configure the OpenTelemetry Collector. Follow the on-screen commands to install **otelcol-contrib**.

![](https://substack-post-media.s3.amazonaws.com/public/images/2dde88fd-3ee4-4202-b501-9a64660dca03_1600x888.png)

To begin capturing metrics from Kafka, we'll use the OpenTelemetry Kafka Metrics Receiver. This tool gathers a variety of Kafka metrics including data on brokers, topics, partitions, and consumer groups directly from your Kafka server. It then converts this information into the OpenTelemetry Protocol (OTLP) format. Let’s add kafkametrics to our opentelemetry config file.   
  
Open the **config.yaml** file in the **otelcol-contrib** folder and under the receiver section, add

```
kafkametrics:
   protocol_version: 2.0.0
   brokers: localhost:9092
   scrapers:
     - brokers
     - topics
     - consumers
```

And under the pipeline section, add kafkametrics in the receiver array:

```
 pipelines:   
metrics:
     receivers: [otlp,kafkametrics]
```

Now that we have this setup, let's create our tracing.js file, which will track metrics and send them to SigNoz through OpenTelemetry.

Follow the on-screen instructions to install the required libraries and create a `tracing.js` file.

With OpenTelemetry set up in your Node.js application, the next step is to configure SigNoz to receive and display Kafka metrics.

Let’s run our application.

**Step 1: Run OTel Collector**

Run this command inside the **otelcol-contrib** directory that you created in the install Otel Collector step

```
./otelcol-contrib --config ./config.yaml &> otelcol-output.log & echo "$!" > otel-pid
```

**Step 2: Run the node.js Application and Tracing:**

```
node -r ./tracing.js app.js
```

Once you start your application, hit the APIs using curl to send sample data. Once you start sending data through your endpoint, you’ll see your application tracking metrics on your signoz dashboard.

![](https://substack-post-media.s3.amazonaws.com/public/images/c0763a88-02af-468a-9abc-ba1a99036e3c_1600x243.png)

Congratulations! You have successfully set up the node.js application which tracks down kafkametrics on signoz!

Once your application is running and producing/consuming messages from Kafka, and your OpenTelemetry Collector is configured to forward traces to SigNoz, you should start seeing Kafka metrics in your SigNoz dashboard. Use these insights to monitor your Kafka cluster's health and performance, troubleshoot issues, and optimize your data streaming processes.

Final step, let’s visualize the data that is being received by signoz.

### Visualize your Metrics:

Navigate to the dashboard section on your Signoz and create a new dashboard. Once you create a new dashboard, you’ll have a sample dashboard setup.

![](https://substack-post-media.s3.amazonaws.com/public/images/967a0782-a469-420b-b892-87f0e022413c_1600x652.png)

Now, we can add a panel and visualize our metrics on this dashboard. Let's create a panel to track the POST API calls.

To do that, navigate to the dashboard, click on "**Add Panel,**" and select "**Time Series.**"

In the panel settings, you'll find an option to use the query builder, which makes it easy to create your query.

In the dropdown menu, select "Traces," and just below that, choose "**http.method = POST.**"

![](https://substack-post-media.s3.amazonaws.com/public/images/40087e07-372c-484b-bc2c-2ac84afef096_1600x1542.png)

Once you've selected these options, click on "**Save & Run Query.**" If you've made the API calls, you should see a chart similar to the one in the screenshot.

![](https://substack-post-media.s3.amazonaws.com/public/images/3511cf8c-565d-4aeb-9629-fc9d61299560_1600x657.png)

The screenshot above shows how the POST API calls are being tracked and visualized.

Now, let's dive into monitoring Kafka metrics. To get started, you'll need to know which metrics are available for tracking. This information is outlined in the metadata.yaml file found in the OpenTelemetry Collector Contrib repository on GitHub.

Here's how to set up a new panel for tracking Kafka metrics:

- Create a new panel in on the Signoz dashboard and select the "time-series" visualization type.
- Navigate to the query builder to define your metrics query.
- For the metrics, enter "**kafka\_brokers**" which allows you to track the activity and health of your Kafka brokers.
- To filter the metrics by a specific Kafka instance, use the "**WHERE**" clause and sort by host\_name. This is useful if you’re running multiple Kafka instances and need to isolate metrics for a particular host.
- After configuring your query, click on “**Stage & Run Query**” to execute it.

![](https://substack-post-media.s3.amazonaws.com/public/images/fa8aebb3-d9a1-4b45-b558-f7a1bd653f75_1600x1539.png)

Our Dashboard should with different kafkametrics and POST API metrics should like this:

![](https://substack-post-media.s3.amazonaws.com/public/images/e4247b49-0cce-401c-8a83-1ce9622efdba_1600x1098.png)

Integrating Kafka metrics into SigNoz using Node.js and OpenTelemetry provides a powerful way to observe and optimize your streaming data pipelines.

By following these steps, even users with a basic understanding of observability can set up a comprehensive monitoring solution that offers deep insights into Kafka's performance and ensures reliable data processing. I

If you have any questions or queries, please reach out to the Signoz team on Slack!

**Happy monitoring!**
