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

  // Initialize Materialize Plugins

  $('.modal').modal();

  // Put in correct text / year

  $('title').text(`${version} Your Mood`);
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  $('#year').text(new Date().getFullYear());

});

// Function for displaying and logging errors

function engineError(display, log, code) {

  appError = true;
  $('body').css('background-color', 'black');
  $('#quote').text(display);
  $('#error-code').text(`Error code ${code}`);
  console.error(log);

}

// Pull quotes from backend

console.log('Pulling quotes from backend...');

$.getJSON(`http://improveyourmood.xyz/${version.toLowerCase()}_quote_serializer.php`)

  // Move on to next step

  .done(function(data) {

    $.each(data, function(key, val) {

      quotes.push(val);

    });

    console.log(`Successfully pulled ${quotes.length} quotes from backend.`);

    // Pull colours from backend

    console.log('Pulling colours from backend...');

    $.getJSON('http://improveyourmood.xyz/colour_serializer.php')

      // Move on to next step

      .done(function(data) {

        $.each(data, function(key, val) {

          colours.push(val);

        });

        console.log(`Successfully pulled ${colours.length} colours from backend.`);

        var reloadQuote;
        var reloadColour;
        var quoteNum;
        var colourNum;
        var settings;
        var backPressed;

        // Pull settings from backend

        console.log('Pulling settings from backend...');

        $.getJSON('http://improveyourmood.xyz/settings_serializer.php')

          // Move on to next step

          .done(function(data) {

            settings = {};

            $.each(data, function(key, val) {

              // If JSON parsable, parse

              try {

                settings[key] = JSON.parse(val)

              } catch (error) {

                settings[key] = val;

              }

            });

            console.log(`Successfully pulled ${Object.keys(settings).length} settings from backend.`);

            // Function for reloading the quote

            reloadQuote = function() {

              // If backend has no quotes, throw an error

              if (quotes.length === 0) {

                console.warn('There are no quotes!')
                throw new Error();

              }

              lastNum = quoteNum;
              quoteNum = Math.floor(quotes.length * Math.random());

              // If all quotes are used and no repeats is enabled, start again

              if (usedQuotes.length === quotes.length && settings['no_repeats']) {

                usedQuotes = [];

              }

              // If MoodEngine trys to use the same quote twice, or one that has already been used, generate a new one

              while (lastNum === quoteNum || settings['no_repeats'] && usedQuotes.includes(quoteNum)) {

                quoteNum = Math.floor(quotes.length * Math.random());

              }

              // Add quote to used quotes and quote history

              usedQuotes.push(quoteNum);
              quoteHistory.push(quoteNum);

              let quote = quotes[quoteNum];

              // Display quote on the text element

              $('#quote').text(quote);

            };

            // Function for reloading the colour

            reloadColour = function() {

              // If backend has no colours, throw an error

              if (colours.length === 0) {

                console.warn('There are no colours!')
                throw new Error();

              }

              lastNum = colourNum;
              colourNum = Math.floor(colours.length * Math.random());

              // If MoodEngine trys to use the same colour twice, generate a new one

              while (lastNum === colourNum) {

                colourNum = Math.floor(colours.length * Math.random());

              }

              // Add colour to used quotes and quote history

              usedColours.push(colourNum);
              colourHistory.push(colourNum);

              let colour = colours[colourNum];

              // Apply colour to background

              $('body').css('background-color', `#${colour}`);

            };

            // Auto reload

            var time_setting = localStorage.getItem('reload_interval') ? localStorage.getItem('reload_interval') : settings['reload_interval'];

            window.setInterval(function() {

              if (!$('main').hasClass('manual-reload')) {

                reloadEngine();
                console.log(`Auto reloaded after ${time_setting}ms`);

              }

            }, time_setting);

            // Set the correct values in the settings inputs and tooltips

            $('.settings-input').each(function() {

              let setting = $(this).attr('name');
              let value = localStorage.getItem(setting) ? localStorage.getItem(setting) : settings[setting];
              $(this).val(value);
              $(this).parent().find('label').addClass('active');

            });

            $('.tooltipped').each(function() {

              // Add the text about the default to the current text

              let value = `${$(this).attr('data-tooltip')}<br>The default is ${settings[$(this).attr('data-setting')]}.`
              $(this).attr('data-tooltip', value);

              // Initialize the Materialize tooltip plugin

              $('.tooltipped').tooltip({
                html: true
              });

            });

            // Toggle auto reload when the button is clicked

            function toggleAutoReload() {

              $('#auto-reload-icon').text($('#auto-reload-icon').text() === 'autorenew' ? 'close' : 'autorenew');
              $('main').toggleClass('manual-reload');
              Materialize.toast('Auto Reload Toggled!', settings['toast_interval']);

            }

            $('#toggle-auto-reload').click(function() {

              toggleAutoReload();

            });

            // Try to initialize the MoodEngine if there are no errors

            if (!appError) {

              console.log('Initializing MoodEngine...');

              try {

                reloadQuote();
                reloadColour();
                $('.fixed-action-btn').removeClass('hide');
                console.log('MoodEngine initialized.');

                // If an error, display/log it

              } catch (error) {

                var message = 'Failed to initialize MoodEngine.';
                engineError(message, message, 3);

              }

            }

            $(document).keydown(function(e) {

              let reload_shortcuts = localStorage.getItem('reload_keys') ? localStorage.getItem('reload_keys') : settings['reload_keys'];

              // If a key in the reload keys array is pressed, reload

              if (reload_shortcuts.includes(e.which) && $('main').hasClass('manual-reload')) {

                reloadEngine();

              }

              // If a key in the auto reload keys array is pressed, toggle auto reload

              if (settings['auto_reload_keys'].includes(e.which)) {

                console.log('Auto Reload Key Pressed');

                toggleAutoReload();

              }

              // If a key in the back keys array is pressed, go back by generating quotes from the history arrays

              if (settings['back_keys'].includes(e.which) && $('main').hasClass('manual-reload') && usedQuotes.length > 1) {

                if (!backPressed) {

                  Materialize.toast('Press again to go to the previous quote/colour.', settings['toast_interval']);
                  backPressed = true;

                }

                quoteNum = quoteHistory.length > 1 ? quoteHistory.pop() : quoteHistory[0];

                let quote = quotes[quoteNum];

                $('#quote').text(quote);

                colourNum = colourHistory.length > 1 ? colourHistory.pop() : colourHistory[0];

                let colour = colours[colourNum];

                $('body').css('background-color', `#${colour}`);

              }

            });

          })

          // If pulling settings from backend fails, display/log the error

          .fail(function(data) {

            engineError('Failed to contact server. Try again later.', 'Failed to pull settings from backend.', '1c');

          });

        // Function to reload both quotes and colour

        function reloadEngine() {

          if (!appError) {

            reloadQuote();
            reloadColour();

            // Set backpressed to false for going back
            backPressed = false;

          }

        }

        $('main').click(function() {

          // Reload when main element is clicked (which is most of DOM)

          if ($(this).hasClass('manual-reload')) {

            reloadEngine();

          }

        });

        // When user trys to save settings

        $('#save-settings-button').click(function() {

          let local_settings = {};
          let has_input = false;

          $('.settings-input').each(function() {

            // Construct the object using values
            local_settings[$(this).attr('name')] = $(this).val();

            // Detect if input is blank
            has_input = $(this).val() ? true : false;

          });

          // If all inputs are not blank

          if (has_input) {

            try {

              $.each(local_settings, function(key, val) {

                // If the set value is the same as the default, just remove it from localStorage and use backend value

                if (val === settings[key]) {

                  localStorage.removeItem(key);

                  // Otherwise set it in localStorage

                } else {

                  localStorage.setItem(key, val);

                }

              });

              // Reload the page for settings to come into effect

              Materialize.toast('Settings Saved!', settings['toast_interval']);
              window.location.reload();

              // Catch any unexpected errors and display/log them

            } catch (error) {

              Materialize.toast('Unable To Save Settings. An Error Occured.', settings['toast_interval']);
              console.error('Couldn\'t save settings.');

            }

            // Close the modal no matter what

            $('#settings-modal').modal('close');

          }

        });

        // Set desired settings to default using the attr on the default button

        $('.default-button').each(function() {

          $(this).click(function() {

            localStorage.removeItem($(this).attr('data-setting'));
            window.location.reload();

          });

        });

        // The form is just for show, don't allow submitting

        $('#settings-form').submit(function() {

          return false;

        });

        // Functions to check what was pulled from the backend in the console

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

      // If pulling colours from backend fails, display/log the error

      .fail(function(data) {

        engineError('Failed to contact server. Try again later.', 'Failed to pull colours from backend.', '1b');

      });

  })

  // If pulling quotes from backend fails, display/log the error

  .fail(function(data) {

    engineError('Failed to contact server. Try again later.', 'Failed to pull quotes from backend.', '1a');

  });
