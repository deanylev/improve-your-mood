function valError(input, id, error) {

  let div = $(`.validation-errors[data-input="${input}"]`);

  if (!$(`#${input}_${id}`).length) div.append(`<p id="${input}_${id}">${error}</p>`);

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

$('#user').on('keyup change', function(e) {

  let input = $(this);

  if (input.val()) {

    clearError('user', 'blank');

    if (input.val().indexOf(' ') > -1) {

      clearError('user', 'exists');
      valError('user', 'spaces', 'Username can\'t contain spaces.');

    } else {

      clearError('user', 'spaces');

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

  } else {

    clearError('user', 'spaces');
    clearError('user', 'exists');
    valError('user', 'blank', 'Username can\'t be blank.');

  }

});

$('#password').on('keypress keydown keyup change', function() {

  if ($(this).val() && $(this).val().length < 8) {

    valError('password', 'length', 'Password must be at least 8 characters.');

  } else {

    clearError('password', 'length');

  }

});

$('#password, #password_confirmation').on('keypress keydown keyup change', function() {

  if ($('#password').val() !== $('#password_confirmation').val()) {

    valError('password_confirmation', 'match', 'Passwords don\'t match.');

  } else {

    clearError('password_confirmation', 'match');

  }

});
