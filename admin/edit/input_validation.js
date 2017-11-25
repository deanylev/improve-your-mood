$('#password').on('keypress keydown keyup change', function() {

  let input = $(this).val();
  let passwordStrength = 0;
  let strengthText = $('#password_strength');

  strengthText.empty();
  strengthText.removeClass();

  $('#password_confirmation').attr('disabled', !input);

  if (input) {

    if (input.length >= 8) {

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

    }

  }

});

$('form').submit(function() {

  let form = $(this);

  $('.fa-spinner').removeClass('d-none');

  $.ajax({
    data: `${form.serialize()}&no_message=true`,
    method: 'POST',
    url: '../modify.php',
    success: function(response) {
      if (response) {
        response = JSON.parse(response);
        if (response.type === 'danger') {
          $('.response').text(response.message);
          $('.fa-spinner').addClass('d-none');
          $('#modal').modal('hide');
        }
      } else {
        window.location.href = form.attr('data-go-to');
      }
    }
  });

  return false;

});
