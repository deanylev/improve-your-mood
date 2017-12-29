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

    } else {

      strengthText.html('(too short)');

    }

  }

});

$('#main-edit-form').submit(function() {

  let form = $(this);

  $('.fa-spinner').removeClass('d-none');
  $('.validation-errors').empty();

  $.ajax({
    data: `${form.serialize()}&no_message=true`,
    method: 'POST',
    url: '../modify.php',
    success: function(response) {
      try {
        response = JSON.parse(response);
        $.each(response, function(key, val) {
          let field = Object.keys(val)[0];
          let append = $(`div[data-field="${field}"]`).find('.validation-errors').is(':empty') ? val[field] : `<br>${val[field]}`;
          $(`div[data-field="${field}"]`).find('.validation-errors').append(append);
        });
        $('#modal').modal('hide');
        $('.fa-spinner').addClass('d-none');
      } catch (error) {
        console.log(response);
        let url = response.startsWith('http') ? response : `../${response}`;
        window.location.href = url;
      }
    }
  });

  return false;

});

$('#image').fineUploader({
  multiple: false,
  validation: {
    acceptFiles: 'image/png',
    allowedExtensions: ['png'],
    sizeLimit: 2000000
  },
  request: {
    endpoint: 'upload.php'
  },
  deleteFile: {
    enabled: true,
    endpoint: 'upload.php'
  },
  callbacks: {
    onSubmitted: function() {
      $('#save-button').attr('disabled', true);
    },
    onComplete: function() {
      $('#save-button').removeAttr('disabled');
    }
  }
}).on('error', function(event, id, name, reason) {

  $('span[role="reason"]').text(`- ${reason}`);

}).on('complete', function(event, id, name, responseJSON) {

  if (responseJSON.success === true) {

    $('#image_name').val(responseJSON.name);
    $('#image-preview').remove();

  }

}).on('delete', function(event, id, name, responseJSON) {

  $('#image_name').val('');

});

$('#remove-image').click(function() {

  $('#image_name').val('');
  $('#image-preview').remove();

});

$('#colour').keyup(function() {

  $(this).css('background-color', `#${$(this).val()}`);

});
