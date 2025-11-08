# CivicEase Webhook for Dialogflow

This is a simple Node.js webhook for the Dialogflow “Report Issue” intent.

## Deployment on Vercel
1. Push this repo to GitHub.
2. Log in to Vercel and import this repo.
3. Deploy — the endpoint will be:  
   `https://<your‑project>.vercel.app/api/webhook`
4. In Dialogflow, go to Fulfillment → Webhook → Paste the URL above.
5. In Intent “Report Issue”, enable “Use webhook”.

## Usage
When a user reports a `problem_type`, `Area`, and optional `Description`, the webhook logs it to console and returns a confirmation message.

## Next Steps
- Integrate Google Sheets or database to store reports.
- Add authentication, multiple languages, voice input.
