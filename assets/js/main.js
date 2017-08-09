var whatQuotes;
var whatColours;

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

    reloadColour();

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

  $(this).keypress(function(e) {

    if (e.which === 32 && $('main').hasClass('manual-reload')) {

      reloadEngine();

    }


  });

  $('#logo').hover(function() {

    $('#build-version').toggleClass('hide');

  });

  window.setInterval(function() {

    if ($('#auto-reload-disabled').hasClass('hide')) {

      reloadEngine();

    }

  }, 3500);

  $('#toggle-auto-reload').click(function() {

    $('.auto-reload-icon').toggleClass('hide');
    $('main').toggleClass('manual-reload');
    Materialize.toast('Auto Reload Toggled!', 1000);

  });

  whatQuotes = function() {

    console.log(quotes);

  };

  whatColours = function() {

    console.log(colours);

  };

});
