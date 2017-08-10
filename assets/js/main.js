var whatQuotes;
var whatColours;
var whatSettings;
var usedQuotes = [];
var usedColours = [];
var quoteHistory = [];
var colourHistory = [];
var version = $('html').attr('data-version');
var quotes = [];
var colours = [];

$.getJSON(version.toLowerCase() + '_quote_serializer.php', function(data) {

  $.each(data, function(key, val) {

    quotes.push(val);

  });

  console.log('Successfully pulled ' + quotes.length + ' quotes from backend.');

});

$.getJSON('colour_serializer.php', function(data) {

  $.each(data, function(key, val) {

    colours.push(val);

  });

  console.log('Successfully pulled ' + colours.length + ' colours from backend.');

});

$(document).ready(function() {

  $('title').text(version + ' Your Mood');
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  $('#year').text(new Date().getFullYear());

  var reloadQuote;
  var reloadColour;
  var quoteNum;
  var colourNum;
  var settings;

  $.getJSON('settings_serializer.php', function(data) {

    settings = {};

    $.each(data, function(key, val) {

      settings[key] = val;

    });

    console.log('Successfully pulled ' + Object.keys(settings).length + ' settings from backend.');

    reloadQuote = function() {

      lastNum = quoteNum;
      quoteNum = Math.floor(quotes.length * Math.random());

      if (usedQuotes.length === quotes.length && settings['no_repeats']) {

        usedQuotes = [];

      }

      while (lastNum === quoteNum || settings['no_repeats'] && usedQuotes.includes(quoteNum)) {

        quoteNum = Math.floor(quotes.length * Math.random());

      }

      usedQuotes.push(quoteNum);
      quoteHistory.push(quoteNum);

      let quote = quotes[quoteNum];

      $('#quote').text(quote);

    };

    reloadQuote();

    reloadColour = function() {

      lastNum = colourNum;
      colourNum = Math.floor(colours.length * Math.random());

      while (lastNum === colourNum) {

        colourNum = Math.floor(colours.length * Math.random());

      }

      usedColours.push(colourNum);
      colourHistory.push(colourNum);

      let colour = colours[colourNum];

      $('body').css('background-color', '#' + colour);

    };

    reloadColour();

    window.setInterval(function() {

      if ($('#auto-reload-disabled').hasClass('hide')) {

        reloadEngine();

      }

    }, settings['reload_interval']);

    $('#toggle-auto-reload').click(function() {

      $('.auto-reload-icon').toggleClass('hide');
      $('main').toggleClass('manual-reload');
      Materialize.toast('Auto Reload Toggled!', settings['toast_interval']);

    });

    var backPressed;

    $(document).keypress(function(e) {

      if (settings['reload_keys'].includes(e.which) && $('main').hasClass('manual-reload')) {

        reloadEngine();

      }

      if (settings['back_key'].includes(e.which) && $('main').hasClass('manual-reload') && usedQuotes.length > 1) {

        if (!backPressed) {

          Materialize.toast('Press again to go to the previous quote/colour.', settings['toast_interval']);
          backPressed = true;

        }

        quoteNum = quoteHistory.pop();

        let quote = quotes[quoteNum];

        $('#quote').text(quote);

        colourNum = colourHistory.pop();

        let colour = colours[colourNum];

        $('body').css('background-color', '#' + colour);

      }

    });

  });

  function reloadEngine() {

    reloadQuote();
    reloadColour();

  }

  $('main').click(function() {

    if ($(this).hasClass('manual-reload')) {

      reloadEngine();

    }

  });

  whatQuotes = function() {

    console.log(quotes);

  };

  whatColours = function() {

    console.log(colours);

  };

  whatSettings = function() {

    console.log(settings);

  };

});
