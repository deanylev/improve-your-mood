$('form').submit(function() {

  $('.fa-spinner').removeClass('d-none');
  $('.validation-errors').empty();

  $.ajax({
    data: `${$(this).serialize()}&no_message=true`,
    method: 'POST',
    url: 'signup.php',
    success: function(response) {
      try {
        response = JSON.parse(response);
        $.each(response, function(key, val) {
          let field = Object.keys(val)[0];
          let append = $(`.validation-errors[data-field="${field}"]`).is(':empty') ? val[field] : `<br>${val[field]}`;
          $(`.validation-errors[data-field="${field}"]`).append(append);
        });
        $('.fa-spinner').addClass('d-none');
      } catch (error) {
        window.location.href = '../home';
      }
    }
  });

  return false;

});
