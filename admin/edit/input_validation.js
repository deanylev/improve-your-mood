function valError(input, error) {

  let text = $(`.validation-error[data-input="${input}"]`);

  text.text(error);

  if (error) {

    $('form').addClass('errors');
    $('#save-button').attr('disabled', true);

  } else if (!$('.validation-error:not(:empty)').length) {

    $('form').removeClass('errors');
    $('#save-button').removeAttr('disabled');

  }

}

$('#user').on('keypress keydown keyup change', function() {

  let input = $(this);

  if (input.val()) {

    if (input.val().indexOf(' ') > -1) {

      valError('user', 'Username can\'t contain spaces.');

    } else {

      $.ajax({
        data: {
          user: input.val(),
          id: itemId
        },
        method: 'POST',
        url: 'check_username.php',
        success: function(response) {
          if (response === 'exists') {

            valError('user', 'Username already exists.');

          } else {

            valError('user', '');

          }
        }
      });

    }

  } else {

    valError('user', 'Username can\'t be blank.');

  }

});

$('#password').on('keypress keydown keyup change', function() {

  if ($(this).val() && $(this).val().length < 8) {

    valError('password', 'Password must be at least 8 characters.');

  } else {

    valError('password', '');

  }

});

$('#password, #password_confirmation').on('keypress keydown keyup change', function() {

  if ($('#password').val() !== $('#password_confirmation').val()) {

    valError('password_confirmation', 'Passwords don\'t match.');

  } else {

    valError('password_confirmation', '');

  }

});
