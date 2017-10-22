function valError(input, id, error) {

  let div = $(`.validation-errors[data-input="${input}"]`);

  div.append(`<p id="${input}_${id}">${error}</p>`);

  $('form').addClass('errors');
  $('#save-button').attr('disabled', true);

}

function clearError(input, id) {

  $(`#${input}_${id}`).remove();

  if (!$('.validation-errors p').length) {

    $('form').removeClass('errors');
    $('#save-button').removeAttr('disabled');

  }

}

$('#user').on('keypress keydown keyup change', function(e) {

  $('.validation-errors[data-input="user"] p').remove();

  let input = $(this);

  if (input.val()) {

    if (input.val().indexOf(' ') > -1) {

      valError('user', 'spaces', 'Username can\'t contain spaces.');

    } else {

      clearError('user', 'spaces');

      if (e.type === 'change') {

        $.ajax({
          data: {
            user: input.val(),
            id: itemId
          },
          method: 'POST',
          url: 'check_username.php',
          success: function(response) {
            if (response === 'exists') {

              valError('user', 'exists', 'Username already exists.');

            } else {

              clearError('user', 'exists');

            }
          }
        });

      }

    }

  } else {

    valError('user', 'blank', 'Username can\'t be blank.');

  }

});

$('#password').on('keypress keydown keyup change', function() {

  $('.validation-errors[data-input="password"] p').remove();

  if ($(this).val() && $(this).val().length < 8) {

    valError('password', 'length', 'Password must be at least 8 characters.');

  } else {

    clearError('password', 'length');

  }

});

$('#password, #password_confirmation').on('keypress keydown keyup change', function() {

  $('.validation-errors[data-input="password_confirmation"] p').remove();

  if ($('#password').val() !== $('#password_confirmation').val()) {

    valError('password_confirmation', 'match', 'Passwords don\'t match.');

  } else {

    clearError('password_confirmation', 'match');

  }

});
