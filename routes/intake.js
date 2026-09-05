const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');
const { classifyAndDraft } = require('../services/classify');
const { sendSms, sendEmail } = require('../services/messaging');
const { sanitizeLeadInput } = require('../services/validators');

router.post('/', async (req, res) => {
  const { errors, clean } = sanitizeLeadInput(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  // Dedupe: same message + same contact info within the last hour is
  // almost always a double form submission, not a second lead.
  const orFilter = [];
  if (clean.email) orFilter.push(`email.eq.${clean.email}`);
  if (clean.phone) orFilter.push(`phone.eq.${clean.phone}`);

  const { data: recentDupes } = await supabase
    .from('leads')
    .select('id')
    .eq('message', clean.message)
    .or(orFilter.join(','))
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  if (recentDupes && recentDupes.length > 0) {
    return res.status(200).json({ status: 'duplicate_ignored' });
  }

  let aiResult;
  try {
    aiResult = await classifyAndDraft(clean);
  } catch (err) {
    console.error('Classification failed:', err.message);
    aiResult = {
      urgency: 'warm',
      coverage_type: 'unknown',
      reply: `Hi ${clean.name}, thanks for reaching out! One of our agents will follow up with you shortly.`
    };
  }

  const { data: lead, error: insertError } = await supabase
    .from('leads')
    .insert({
      name: clean.name,
      email: clean.email || null,
      phone: clean.phone || null,
      message: clean.message,
      source: req.body.source || 'website',
      coverage_type: aiResult.coverage_type,
      urgency: aiResult.urgency,
      ai_reply: aiResult.reply,
      status: 'new'
    })
    .select()
    .single();

  if (insertError) {
    console.error('Insert failed:', insertError.message);
    return res.status(500).json({ error: 'Could not save lead.' });
  }

  // Message-send failures should never lose the lead itself, so this
  // block is isolated from the insert above.
  try {
    if (clean.phone) await sendSms(clean.phone, aiResult.reply);
    if (clean.email) await sendEmail(clean.email, 'Thanks for reaching out', aiResult.reply);

    await supabase.from('messages_log').insert({
      lead_id: lead.id,
      channel: clean.phone ? 'sms' : 'email',
      direction: 'outbound',
      content: aiResult.reply
    });

    await supabase
      .from('leads')
      .update({ status: 'contacted', last_contacted_at: new Date().toISOString() })
      .eq('id', lead.id);
  } catch (err) {
    console.error('Message send failed:', err.message);
  }

  if (aiResult.urgency === 'hot') {
    try {
      const { data: agent } = await supabase.from('agents').select('*').limit(1).single();
      if (agent && agent.phone) {
        await sendSms(agent.phone, `Hot lead: ${clean.name} - ${clean.message.slice(0, 100)}`);
        await supabase.from('leads').update({ status: 'escalated' }).eq('id', lead.id);
      }
    } catch (err) {
      console.error('Escalation failed:', err.message);
    }
  }

  res.status(201).json({ status: 'received', lead_id: lead.id });
});

module.exports = router;
         
