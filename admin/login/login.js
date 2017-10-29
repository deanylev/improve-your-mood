if (!lscache.get('loginAttempts')) lscache.set('loginAttempts', 0);

$('form').submit(function() {

  if (!lscache.get('loginLocked')) {

    $('#password').removeClass('wrong');
    $('.fa-spinner').removeClass('d-none');

    $.ajax({
      data: $('form').serialize(),
      method: 'POST',
      url: 'authenticate.php',
      success: function(response) {
        if (response === 'success') {

          window.location.href = '../home'

        } else {

          $('.text-danger').text('Invalid credentials.');
          $('.fa-spinner').addClass('d-none');
          $('#password').addClass('wrong');
          $('#password').focus();

          lscache.set('loginAttempts', lscache.get('loginAttempts') + 1);

          if (lscache.get('loginAttempts') === 10) {

            lscache.set('loginAttempts', 0);
            lscache.set('loginLocked', true, 10);

          }

        }
      }
    });

  } else {

    $('.text-danger').text('Too many login attempts. Try again in 10 minutes.');

  }

  return false;

});
