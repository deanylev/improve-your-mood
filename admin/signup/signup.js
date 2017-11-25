$('form').submit(function() {

  $('.fa-spinner').removeClass('d-none');

  $.ajax({
    data: `${$(this).serialize()}&no_message=true`,
    method: 'POST',
    url: 'signup.php',
    success: function(response) {
      if (response === 'success') {
        window.location.href = '../home';
      } else {
        $('.response').text(response);
        $('.fa-spinner').addClass('d-none');
      }
    }
  });

  return false;

});
