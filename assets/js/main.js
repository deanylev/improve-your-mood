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
var appError;

$(document).ready(function() {

  $('title').text(version + ' Your Mood');
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  $('#year').text(new Date().getFullYear());

  $('#retry-button').click(function() {

    window.location.reload();

  });

});

function engineError(display, log, code) {

  appError = true;
  $('body').css('background-color', 'black');
  $('#quote').text(display);
  $('#error-code').text('Error code ' + code);
  console.error(log);

}

console.log('Pulling quotes from backend...');

$.getJSON('http://improveyourmood.xyz/' + version.toLowerCase() + '_quote_serializer.php')

  .done(function(data) {

    $.each(data, function(key, val) {

      quotes.push(val);

    });

    console.log('Successfully pulled ' + quotes.length + ' quotes from backend.');

    console.log('Pulling colours from backend...');

    $.getJSON('http://improveyourmood.xyz/' + 'colour_serializer.php')

      .done(function(data) {

        $.each(data, function(key, val) {

          colours.push(val);

        });

        console.log('Successfully pulled ' + colours.length + ' colours from backend.');

        var reloadQuote;
        var reloadColour;
        var quoteNum;
        var colourNum;
        var settings;
        var backPressed;

        console.log('Pulling settings from backend...');

        $.getJSON('http://improveyourmood.xyz/' + 'settings_serializer.php')

          .done(function(data) {

            settings = {};

            $.each(data, function(key, val) {

              settings[key] = val;

            });

            console.log('Successfully pulled ' + Object.keys(settings).length + ' settings from backend.');

            reloadQuote = function() {

              if (quotes.length === 0) {

                console.warn('There are no quotes!')
                throw new Error();

              }

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

            reloadColour = function() {

              if (colours.length === 0) {

                console.warn('There are no colours!')
                throw new Error();

              }

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

            window.setInterval(function() {

              if (!$('main').hasClass('manual-reload')) {

                reloadEngine();

              }

            }, settings['reload_interval']);

            $('#toggle-auto-reload').click(function() {

              $('#auto-reload-icon').text($('#auto-reload-icon').text() === 'autorenew' ? 'close' : 'autorenew');
              $('main').toggleClass('manual-reload');
              Materialize.toast('Auto Reload Toggled!', settings['toast_interval']);

            });

            if (!appError) {

              console.log('Initializing MoodEngine...');

              try {

                reloadQuote();
                reloadColour();
                $('#toggle-auto-reload').removeClass('hide');
                console.log('MoodEngine initialized.');

              } catch (error) {

                var message = 'Failed to initialize MoodEngine.';
                engineError(message, message, 3);

              }

            }

            $(document).keypress(function(e) {

              if (settings['reload_keys'].includes(e.which) && $('main').hasClass('manual-reload')) {

                reloadEngine();

              }

              if (settings['back_key'].includes(e.which) && $('main').hasClass('manual-reload') && usedQuotes.length > 1) {

                if (!backPressed) {

                  Materialize.toast('Press again to go to the previous quote/colour.', settings['toast_interval']);
                  backPressed = true;

                }

                quoteNum = quoteHistory.length > 1 ? quoteHistory.pop() : quoteHistory[0];

                let quote = quotes[quoteNum];

                $('#quote').text(quote);

                colourNum = colourHistory.length > 1 ? colourHistory.pop() : colourHistory[0];

                let colour = colours[colourNum];

                $('body').css('background-color', '#' + colour);

              }

            });

          })

          .fail(function(data) {

            engineError('Failed to contact server. Try again later.', 'Failed to pull settings from backend.', '1c');

          });

        function reloadEngine() {

          if (!appError) {

            reloadQuote();
            reloadColour();
            backPressed = false;

          }

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

      })

      .fail(function(data) {

        engineError('Failed to contact server. Try again later.', 'Failed to pull colours from backend.', '1b');

      });

  })

  .fail(function(data) {

    engineError('Failed to contact server. Try again later.', 'Failed to pull quotes from backend.', '1a');

  });
