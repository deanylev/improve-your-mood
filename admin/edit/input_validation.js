function valError(input, error) {

  let text = $(`.validation-error[data-input="${input}"]`);

  text.text(error);

  if (error) {

    $('form').addClass('errors');
    $('#save-button').attr('disabled', true);

  } else {

    $('form').removeClass('errors');
    $('#save-button').removeAttr('disabled');

  }

}

$('#user').change(function() {

  let input = $(this);

  if (input.val()) {

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
    })

  } else {

    valError('user', 'Username can\'t be blank.');

  }

});

$('#password').change(function() {

  if ($(this).val() && $(this).val().length < 8) {

    valError('password', 'Password must be at least 8 characters.');

  } else {

    valError('password', '');

  }

});

$('#password, #password_confirmation').change(function() {

  if ($('#password').val() !== $('#password_confirmation').val()) {

    valError('password_confirmation', 'Passwords don\'t match.');

  } else {

    valError('password_confirmation', '');

  }

});
