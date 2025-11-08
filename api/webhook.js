// api/webhook.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { WebhookClient } = require('dialogflow-fulfillment');

const SHEET_ID = process.env.SHEET_ID; // set in Vercel dashboard
const SERVICE_ACCOUNT_EMAIL = process.env.SA_EMAIL; // set in Vercel
const PRIVATE_KEY = process.env.SA_PRIVATE_KEY; // set in Vercel (with \n handled)

module.exports = async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  async function reportIssue(agent) {
    try {
      // read parameters coming from Dialogflow
      const problem = agent.parameters.problem_type || 'unknown';
      const area = agent.parameters.Area || 'unknown';
      const description = agent.parameters.Description || '';

      // attempt to write to Google Sheet (if configuration present)
      if (SHEET_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY) {
        const doc = new GoogleSpreadsheet(SHEET_ID);
        await doc.useServiceAccountAuth({
          client_email: SERVICE_ACCOUNT_EMAIL,
          private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // first sheet
        await sheet.addRow({
          Timestamp: new Date().toISOString(),
          Problem: problem,
          Area: area,
          Description: description,
        });
      } else {
        console.warn('Google Sheets not configured — skipping save.');
      }

      agent.add(`✅ Report saved: ${problem} reported at ${area}. Thank you.`);
    } catch (err) {
      console.error('Error saving report:', err);
      agent.add('⚠️ Sorry, something went wrong while saving your report.');
    }
  }

  const intentMap = new Map();
  intentMap.set('Report Issue', reportIssue);

  await agent.handleRequest(intentMap);
};
