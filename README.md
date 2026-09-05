# Instant Quote & Lead Response System (Demo)

A small insurance agency portfolio demo: a lead submits a form, AI classifies
urgency and drafts a personalized reply, the reply goes out instantly by SMS
and/or email, silent leads get an automatic follow-up, and hot leads escalate
to a human agent. A live dashboard shows response-time and volume metrics.

## Project structure
```
insurance-lead-response/
  server.js              -> Express app entry point
  routes/
    intake.js             -> POST /api/intake (new lead webhook)
    followup.js            -> POST /api/followup-check (cron-triggered)
    stats.js                -> GET /api/stats (dashboard data)
  services/
    supabaseClient.js       -> Supabase connection
    classify.js              -> the one AI step (Claude API)
    messaging.js               -> Twilio SMS + Resend email
    validators.js                -> input validation, no AI needed
  public/
    index.html, style.css, script.js     -> lead intake form
    dashboard.html, dashboard.js           -> metrics dashboard
  supabase/
    schema.sql              -> run this once in Supabase
  .env.example
  package.json
```

## 1. Supabase (database)
1. Go to supabase.com -> New project (free tier).
2. Once created, open SQL Editor -> New query, paste the contents of
   `supabase/schema.sql`, and run it.
3. Go to Project Settings -> API. Copy the **Project URL** and the
   **service_role key** (not the anon key — this backend needs write access).

## 2. Twilio (SMS)
1. Create a free Twilio trial account at twilio.com.
2. Get a trial phone number (Console -> Phone Numbers -> Buy a number, free
   trial number is fine for testing).
3. Copy your **Account SID**, **Auth Token**, and the trial number.
4. Note: trial accounts can only text verified numbers — verify your own
   phone number in the Twilio console to test end-to-end.

## 3. Resend (email)
1. Create a free account at resend.com.
2. Get an API key (free tier covers plenty of demo volume).
3. Use their test sending domain, or verify your own domain later.

## 4. Anthropic API (AI classification)
1. Get an API key from console.anthropic.com.
2. This is the only paid-per-use piece — costs are small at demo volume
   (a few cents per hundred leads).

## 5. Local setup
```bash
git clone <your-repo-url>
cd insurance-lead-response
npm install
cp .env.example .env
# fill in every value in .env now
npm start
```
Visit `http://localhost:3000` for the form, `http://localhost:3000/dashboard.html`
for the metrics view.

## 6. Deploy the backend — Render (free tier)
1. Push this project to a GitHub repo.
2. Go to render.com -> New -> Web Service -> connect your GitHub repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Under Environment, add every variable from `.env.example` with your real
   values.
5. Deploy. Render gives you a public URL — that's your live demo link.

## 7. Set up the follow-up cron (free)
Render's free tier sleeps when idle, and its own cron feature requires a paid
plan, so use an external free scheduler instead:
1. Go to cron-job.org (free) and create an account.
2. Create a new cron job: URL = `https://<your-render-url>/api/followup-check?key=<your CRON_SECRET>`,
   method = POST, schedule = every hour.
3. This checks for leads with no response after 24 hours and sends a
   follow-up, up to twice per lead.

## 8. Test end-to-end
1. Submit the form on your live URL with your own phone/email.
2. Confirm you receive the instant reply.
3. Check Supabase Table Editor -> `leads` to confirm the row and
   classification look right.
4. Manually trigger the follow-up endpoint once to confirm it runs without
   errors (it will only act on leads older than 24 hours, so this test just
   confirms no crash).
5. Submit a message that sounds urgent (e.g. "my policy lapsed, I need
   coverage today") and confirm the demo agent number gets an escalation text.

## Notes on scope
This is deliberately built against a synthetic demo agency, not a real
client's systems — no AMS/PMS integration is assumed, because most small
agencies don't have one. When you take this to a real prospect, the intake
form gets replaced by whatever their actual lead source is (Facebook Lead
Ads webhook, their existing contact form, etc.) — the rest of the pipeline
stays the same.
