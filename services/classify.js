const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The only AI step in the whole pipeline. Everything else is deterministic.
async function classifyAndDraft(lead) {
  const prompt = `You are helping a small insurance agency respond instantly to a new lead.

Lead details:
Name: ${lead.name}
Message: "${lead.message}"

Return ONLY valid JSON, no markdown formatting, no preamble, in this exact shape:
{
  "urgency": "hot" | "warm" | "cold",
  "coverage_type": "string, e.g. auto, home, life, business, unknown",
  "reply": "a short, warm, personalized reply under 300 characters, confirming receipt and setting expectation for next step"
}

Classify as "hot" if the message suggests urgency (accident, lapsed coverage, needs coverage today, actively comparing quotes now). "warm" if general interest with a timeline. "cold" if vague or purely informational.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Could not parse AI response as JSON:', text);
    // Fail-safe default keeps the pipeline moving even if the model misbehaves.
    return {
      urgency: 'warm',
      coverage_type: 'unknown',
      reply: `Hi ${lead.name}, thanks for reaching out! One of our agents will follow up with you shortly.`
    };
  }
}

module.exports = { classifyAndDraft };
