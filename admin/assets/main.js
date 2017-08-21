$(document).ready(function() {

  $('#new-input').change(function() {

    $('#colour-preview').css('background-color', '#' + $(this).val());

  });

  $('#full-preview-text').on('keyup keypress keydown', function() {

    $('.full-preview p').text($(this).val());

  });

  $('#full-preview-colour').change(function() {

    $('.full-preview').css('background-color', '#' + $(this).val());

  });

  $(this).keydown(function(e) {

    $('#keycode').text(e.which);

  });

});
