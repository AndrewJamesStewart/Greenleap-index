// GreenLeap landing page behaviour. No dependencies, no tracking.

// Where pilot applications are sent. Leave empty to fall back to the visitor's
// email app; set to a form service URL (Formspree, Basin, Netlify function...)
// that accepts a POST of form data to collect sign-ups without email.
const FORM_ENDPOINT = '';

const SITE_URL = 'https://greenleapesg.com/';
const pilotMsg = document.getElementById('pilot-msg');
// The contact address lives once, in the page's mailto link.
const CONTACT = (pilotMsg.querySelector('a[href^="mailto:"]') || {href: 'mailto:'}).href.slice(7);

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('open', open);
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// GreenPledge
const pledgeShare = document.getElementById('pledge-share');
const pledgeField = document.getElementById('pilot-pledge');
document.querySelectorAll('.pledge').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pledge').forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    const pledge = btn.querySelector('h3').textContent;
    pledgeField.value = pledge;
    document.getElementById('pledge-msg').textContent =
      'Pledge selected: "' + pledge + '". Share it on LinkedIn and tag GreenLeap, or add it to your pilot application.';
    document.getElementById('pledge-linkedin').href =
      'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(SITE_URL + '?pledge=1');
    pledgeShare.hidden = false;
  });
});

// Pilot application
const form = document.getElementById('pilot-form');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate() {
  let first = null;
  form.querySelectorAll('input[required]').forEach(inp => {
    const ok = inp.type === 'email' ? EMAIL_RE.test(inp.value.trim()) : inp.value.trim() !== '';
    if (ok) inp.removeAttribute('aria-invalid');
    else inp.setAttribute('aria-invalid', 'true');
    if (!ok && !first) first = inp;
  });
  return first;
}

function mailtoFallback(data) {
  const sub = encodeURIComponent('GreenLeap founding-partner pilot application');
  const body = encodeURIComponent(
    'Hi GreenLeap team,\n\nI would like to apply for the founding-partner pilot.\n\n' +
    'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') +
    '\nCompany: ' + data.get('company') + '\nRole: ' + data.get('role') +
    '\nGreenPledge: ' + (data.get('pledge') || '-') +
    '\nWhat we need help with: ' + data.get('need') + '\n\nThanks,');
  window.location.href = 'mailto:' + CONTACT + '?subject=' + sub + '&body=' + body;
  pilotMsg.textContent = 'Your email app has opened a message to ' + CONTACT + '. Press send to apply.';
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const bad = validate();
  if (bad) {
    pilotMsg.textContent = 'Please fill in your name, a valid work email and your company.';
    bad.focus();
    return;
  }
  const data = new FormData(form);
  if (data.get('website')) return; // honeypot: bots fill hidden fields
  data.delete('website');

  if (!FORM_ENDPOINT) { mailtoFallback(data); return; }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  pilotMsg.textContent = 'Sending your application…';
  try {
    const res = await fetch(FORM_ENDPOINT, {method: 'POST', body: data, headers: {Accept: 'application/json'}});
    if (!res.ok) throw new Error(res.status);
    form.reset();
    pledgeField.value = '';
    pilotMsg.textContent = 'Thank you. Your application is in and we will be in touch within a few days.';
  } catch (err) {
    pilotMsg.textContent = 'Something went wrong sending your application. Opening your email app instead.';
    mailtoFallback(data);
  } finally {
    btn.disabled = false;
  }
});
