const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');

const app = express();
app.use(express.json());

app.post('/api/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function reportIssue(agent) {
    const problem = agent.parameters.problem_type || "unknown problem";
    const area = agent.parameters.Area || "unknown area";
    const description = agent.parameters.Description || "No description provided";

    console.log(`Problem: ${problem}, Area: ${area}, Description: ${description}`);
    agent.add(`Thanks! Your report for a ${problem} at ${area} has been recorded.`);
  }

  const intentMap = new Map();
  intentMap.set('Report Issue', reportIssue);

  agent.handleRequest(intentMap);
});

// For Vercel serverless, export as module
module.exports = app;
