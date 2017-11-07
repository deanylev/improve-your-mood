$('form').submit(function() {
  $('#password').removeClass('wrong');
  $('.fa-spinner').removeClass('d-none');

  $.ajax({
    data: $('form').serialize(),
    method: 'POST',
    url: 'authenticate.php',
    success: function(response) {
      if (response === 'success') {
        window.location.href = '../home'
      } else {
        $('.text-danger').text(response);
        $('.fa-spinner').addClass('d-none');
        if (response === 'Invalid credentials.') {
          $('#password').addClass('wrong');
          $('#password').focus();
        }
      }
    }
  });

  return false;

});
