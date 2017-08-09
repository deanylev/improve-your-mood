var whatQuotes;
var whatColours;
var whatSettings;

$(document).ready(function() {

  var version = 'Improve';

  $('title').text(version + ' Your Mood');
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  $('#year').text(new Date().getFullYear());

  var quotes;
  var reloadQuote;
  var reloadColour;
  var quoteNum;
  var colourNum;

  $.getJSON(version.toLowerCase() + '_quote_serializer.php', function(data) {

    quotes = [];

    $.each(data, function(key, val) {

      quotes.push(val);

    });

    reloadQuote = function() {

      lastNum = quoteNum;
      quoteNum = Math.floor(quotes.length * Math.random());

      while (lastNum === quoteNum) {

        quoteNum = Math.floor(quotes.length * Math.random());

      }

      let quote = quotes[quoteNum];

      $('#quote').text(quote);

    };

    reloadQuote();

  });

  $.getJSON('colour_serializer.php', function(data) {

    colours = [];

    $.each(data, function(key, val) {

      colours.push(val);

    });

    reloadColour = function() {

      lastNum = colourNum;
      colourNum = Math.floor(colours.length * Math.random());

      while (lastNum === colourNum) {

        colourNum = Math.floor(colours.length * Math.random());

      }

      let colour = colours[colourNum];

      $('body').css('background-color', '#' + colour);

    };

    $(document).keypress(function(e) {

      if (settings['reload_keys'].includes(e.which) && $('main').hasClass('manual-reload')) {

        reloadEngine();

      }

    });

    reloadColour();

  });

  var settings;

  $.getJSON('settings_serializer.php', function(data) {

    settings = {};

    $.each(data, function(key, val) {

      settings[key] = val;

    });

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

  $('#logo').hover(function() {

    $('#build-version').toggleClass('hide');

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
