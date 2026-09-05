const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

router.get('/', async (req, res) => {
  const { data: leads, error } = await supabase.from('leads').select('*');

  if (error) {
    console.error('Stats query failed:', error.message);
    return res.status(500).json({ error: 'Query failed' });
  }

  const total = leads.length;
  const escalated = leads.filter((l) => l.status === 'escalated').length;
  const contacted = leads.filter((l) => l.status !== 'new').length;

  const responseTimes = leads
    .filter((l) => l.last_contacted_at)
    .map((l) => (new Date(l.last_contacted_at) - new Date(l.created_at)) / 1000);

  const avgResponseSeconds = responseTimes.length
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : null;

  res.json({
    total_leads: total,
    contacted,
    escalated,
    response_rate: total ? Math.round((contacted / total) * 100) : 0,
    avg_response_seconds: avgResponseSeconds,
    by_urgency: {
      hot: leads.filter((l) => l.urgency === 'hot').length,
      warm: leads.filter((l) => l.urgency === 'warm').length,
      cold: leads.filter((l) => l.urgency === 'cold').length
    }
  });
});

module.exports = router;
