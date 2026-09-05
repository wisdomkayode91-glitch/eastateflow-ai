const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');
const { sendSms, sendEmail } = require('../services/messaging');

const FOLLOW_UP_DELAY_HOURS = 24;
const MAX_FOLLOW_UPS = 2;

// Hit this endpoint with a scheduled external cron (e.g. cron-job.org)
// as POST /api/followup-check?key=YOUR_CRON_SECRET
router.post('/', async (req, res) => {
  if (req.query.key !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const cutoff = new Date(Date.now() - FOLLOW_UP_DELAY_HOURS * 60 * 60 * 1000).toISOString();

  const { data: staleLeads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'contacted')
    .lt('last_contacted_at', cutoff)
    .lt('follow_up_count', MAX_FOLLOW_UPS);

  if (error) {
    console.error('Follow-up query failed:', error.message);
    return res.status(500).json({ error: 'Query failed' });
  }

  let processed = 0;
  for (const lead of staleLeads || []) {
    const followUpMessage = `Hi ${lead.name}, just following up on your ${lead.coverage_type || 'insurance'} request. Happy to answer any questions whenever you're ready.`;

    try {
      if (lead.phone) await sendSms(lead.phone, followUpMessage);
      if (lead.email) await sendEmail(lead.email, 'Following up', followUpMessage);

      await supabase.from('messages_log').insert({
        lead_id: lead.id,
        channel: lead.phone ? 'sms' : 'email',
        direction: 'outbound',
        content: followUpMessage
      });

      const newCount = lead.follow_up_count + 1;
      await supabase
        .from('leads')
        .update({
          follow_up_count: newCount,
          last_contacted_at: new Date().toISOString(),
          status: newCount >= MAX_FOLLOW_UPS ? 'followed_up' : 'contacted'
        })
        .eq('id', lead.id);

      processed += 1;
    } catch (err) {
      console.error(`Follow-up failed for lead ${lead.id}:`, err.message);
    }
  }

  res.json({ processed });
});

module.exports = router;
