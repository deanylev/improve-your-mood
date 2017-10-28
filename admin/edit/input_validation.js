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
          if (response === 'exists' && !$('#user_spaces').length) {

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

  let input = $(this).val();
  let strengthText = $('#password_strength');

  strengthText.empty();
  strengthText.removeClass();

  $('#password_confirmation').attr('disabled', !input);

  if (input) {

    if (input.length >= 8) {

      clearError('password', 'length');

      let passwordStrength = 0;

      // Lowercase letters
      if (/[a-z]/.test(input)) passwordStrength++;
      // Uppercase letters
      if (/[A-Z]/.test(input)) passwordStrength++;
      // Numbers
      if (/\d/.test(input)) passwordStrength++;
      // Symbols
      if (/[~`!#$%\^&*()+=\-_\[\]\\';,/{}|\\":<>\?]/g.test(input)) passwordStrength++;

      let text;
      let textClass;

      switch (passwordStrength) {

        case 2:
          text = 'medium';
          textClass = 'warning';
          break;
        case 3:
          text = 'strong';
          textClass = 'success';
          break;
        case 4:
          text = 'very strong';
          textClass = 'primary';
          break;
        default:
          text = 'weak';
          textClass = 'danger';
          break;

      }

      strengthText.text(`(${text})`);
      strengthText.addClass(`text-${textClass}`);

    } else {

      valError('password', 'length', 'Password must be at least 8 characters.');

    }


  } else {

    $('#password_confirmation').val('');

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

$('#items_per_page').attr('min', '1');
$('#items_per_page').attr('max', '50000');

$('#items_per_page').on('keypress keydown keyup change', function() {

  if ($(this).val() < 1 || $(this).val() > 50000) {

    valError('items_per_page', 'between', 'Items per page must be between 1 and 50,000.');

  } else {

    clearError('items_per_page', 'between');

  }

});
