$('form:not(.errors)').submit(function() {

  $('.fa-spinner').removeClass('d-none');

  $.ajax({
    data: $(this).serialize(),
    method: 'POST',
    url: 'signup.php',
    success: function(response) {
      if (response === 'success') {
        window.location.href = '../home';
      } else {
        $('.response').text(response);
      }
    }
  });

  return false;

});
