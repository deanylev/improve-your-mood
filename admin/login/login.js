$('form').submit(function() {

  $('input').removeClass('wrong');
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
          let input = $('#username').val() ? '#password' : '#username';
          $(input).addClass('wrong');
          $(input).focus();
        }
      }
    }
  });

  return false;

});
