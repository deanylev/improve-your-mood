$(document).ready(function() {

  meSpeak.loadConfig('assets/js/meSpeak/mespeak_config.json');
  meSpeak.loadVoice('assets/js/meSpeak/en-us.json');

  $(this).keypress(function(e) {

    if (e.which == 32) {

      $('main').click();

    }

  });

  new Clipboard('.copy');

  window.setInterval(function() {

    $('.auto-reload').click();

  }, 3500);

  $('.copy').click(function() {

    Materialize.toast('Text Copied!', 2500);

  });

  $('#toggle-auto-reload').click(function() {

    Materialize.toast('Auto Reload Toggled!', 2500);
    $('main').toggleClass('auto-reload');
    $('#disable-auto-reload-icon').toggleClass('hide');
    $('#enable-auto-reload-icon').toggleClass('hide');

  });

  $('#speak-quote').click(function() {

    $('.voice-toast').remove();
    Materialize.toast('Text Spoken!', 2500, 'voice-toast');
    var text = $('#quote-text').text();
    meSpeak.stop();
    meSpeak.speak(text);

  });

});
