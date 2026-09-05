function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return (
    typeof phone === 'string' &&
    /^\+?[1-9]\d{7,14}$/.test(phone.replace(/[\s()-]/g, ''))
  );
}

function sanitizeLeadInput(body) {
  const errors = [];
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const message = (body.message || '').trim();

  if (!name) errors.push('Name is required.');
  if (!email && !phone) errors.push('Provide an email or phone number.');
  if (email && !isValidEmail(email)) errors.push('Email looks invalid.');
  if (phone && !isValidPhone(phone)) errors.push('Phone number looks invalid.');
  if (!message) errors.push('Message is required.');

  return { errors, clean: { name, email, phone, message } };
}

module.exports = { isValidEmail, isValidPhone, sanitizeLeadInput };
