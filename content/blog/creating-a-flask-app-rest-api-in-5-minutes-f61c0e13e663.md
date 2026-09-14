---
title: "Creating a Flask App REST API in 5 minutes."
subtitle: "Have you ever got stuck in a situation where you had to develop quick applications to solve a problem?"
date: 2021-05-29T10:20:39.770Z
slug: creating-a-flask-app-rest-api-in-5-minutes-f61c0e13e663
---

![Photo byFlorian OlivoonUnsplash](https://substack-post-media.s3.amazonaws.com/public/images/bbb751cc-ef7e-4f03-a1b2-6ebc1cab5ba8_800x533.jpeg)  
*Photo byFlorian OlivoonUnsplash*

Have you ever got stuck in a situation where you had to develop quick applications to solve a problem?

I usually get into these encounters. Sometimes Quick and sharp deadlines haunts you. The first thing a developer does is find a quick solution on Google. *(Until he/she is PRO :p)*

I was working on a CovidBot lately. The cases are rising here in India and we needed a quick solution to deploy. We had a simple Python application to parse the data but we needed an endpoint to store the same on a Database. So, we rolled up the sleeves and created the Flask App.

Here’s a quick overview on how we solved this.

**Problem we solved**: Develop a CRUD application with REST API to serve Content of the bot.  
**Tech Stack used**: Flask

There’s an Amazing tool Named **Yeoman Generator**: <https://github.com/colekettler/generator-flask-api>

This little piece of beauty helped me build API endpoints quickly and seamlessly!

Here’s how I installed It.

### 1. Install Node.js on your System.

Depending on your Operating systems, here are the quick guides to install Node.js on your system.  
A. Mac Os: <https://nodejs.org/en/download/>  
B. Windows : <https://nodejs.org/en/download/>  
C: Linux: <https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04>

### 2. Install “YO”

YO is basically a npm package that resides in the NPM repository with tons of other amazing libraries. Open your Terminal and write the following below command.

> *npm install -g yo*

- - g flag helps you install the package globally.

### 3. Installing Flask Package.

It’s time to install Flask Project using “Yeoman”

> *npm install -g generator-flask*

use the above code on your project terminal to get going.

### 4. Creating the Project.

Time to roll up the sleeves and generate the project quickly.

> *yo flask*

That’s it. We’ll have successfully created the Flask project using Yeoman tool.  
This was easy and quick, right?

Creating a dedicated application is easy if you know how to use the right tools at the right time.

If you are facing any issues, feel free to reach me out. I’ll be happy to help!
