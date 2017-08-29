$(document).ready(function() {

  $('#full-preview-colour').spectrum({
    showInput: true,
    preferredFormat: 'hex',
    move: function(colour) {

      $('.full-preview').css('background-color', colour.toHexString());

    },
    change: function(colour) {

      $('.full-preview').css('background-color', colour.toHexString());

    }
  });

  $('#new-input').change(function() {

    $('#colour-preview').css('background-color', '#' + $(this).val());

  });

  $(this).keydown(function(e) {

    $('#keycode').text(e.which);

  });

});
