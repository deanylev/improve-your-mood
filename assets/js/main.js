var what;
var usedQuotes = [];
var usedColours = [];
var quoteHistory = [];
var colourHistory = [];
var platform = $('html').attr('data-platform');
var quotes = [];
var colours = [];
var settings = {};
var appError;
var networkReported;
var settingsOpen = false;
var start_time;
var pull_time = {};
var reloadEngine;
var manualReload;

// Platform specific stuff

if (platform === 'web') {

  var version = window.location.href.includes('decreaseyourmood') ? 'Decrease' : 'Improve';

} else if (platform === 'app') {

  var version = $('html').attr('data-version');

}

var backend_address = localStorage.getItem('backend_address') ? localStorage.getItem('backend_address') : 'improveyourmood.xyz';

var full_backend_address = `http://${backend_address}/`;

$(document).ready(function() {

  // Initialize Materialize Plugins

  $('#settings-modal').modal({
    ready: function(modal, trigger) {

      settingsOpen = true;

    },
    complete: function() {

      settingsOpen = false;

    }
  });

  // Put in correct text / year

  $('title').text(`${version} Your Mood`);
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  $('#year').text(new Date().getFullYear());

  // Some buttons needs to work straight away

  // Retry loading

  $('#retry-button').click(function() {

    window.location.reload();

  });

  // Clear all settings

  $('#reset-backend-address').click(function() {

    localStorage.removeItem('backend_address');
    window.location.reload();

  });

  // Calculate proper top margin for certain elements

  $('.js-margin').css('margin-top', $(document).height() / 4.5);

});

// Function for displaying and logging errors

function engineError(display, log, code) {

  // If network connection is detected

  if (navigator.onLine) {

    appError = true;
    $('body').css('background-color', 'black');
    $('#quote').text(display);
    $('#quote').addClass('scale-in');
    $('.preloader-wrapper').addClass('hide');
    $('#error-code').text(`Error code ${code}`);
    console.error(log);

  } else if (!networkReported) {

    networkReported = true;
    $('#quote').text('You are not connected to the internet.');
    $('#quote').addClass('scale-in');
    $('.preloader-wrapper').addClass('hide');
    console.log('No internet connection.');

  }

  if (localStorage.getItem('backend_address')) {

    $('#reset-backend-address').removeClass('hide');

  }

}

// Pull quotes from backend

start_time = performance.now();

console.log('Pulling quotes from backend...');

$.getJSON(`${full_backend_address + version.toLowerCase()}_quote_serializer.php`)

  // Move on to next step

  .done(function(data) {

    pull_time['quotes'] = Math.ceil(performance.now() - start_time);

    $.each(data, function(key, val) {

      quotes.push(val);

    });

    console.log(`Successfully pulled ${quotes.length} quotes from backend in ${pull_time['quotes']}ms.`);

    // Pull colours from backend

    start_time = performance.now();

    console.log('Pulling colours from backend...');

    $.getJSON(`${full_backend_address}colour_serializer.php`)

      // Move on to next step

      .done(function(data) {

        pull_time['colours'] = Math.ceil(performance.now() - start_time);

        $.each(data, function(key, val) {

          colours.push(val);

        });

        console.log(`Successfully pulled ${colours.length} colours from backend in ${pull_time['colours']}ms.`);

        var reloadQuote;
        var reloadColour;
        var quoteNum;
        var colourNum;
        var backPressed;

        // Pull settings from backend

        start_time = performance.now();

        console.log('Pulling settings from backend...');

        $.getJSON(`${full_backend_address}settings_serializer.php`)

          // Move on to next step

          .done(function(data) {

            pull_time['settings'] = Math.ceil(performance.now() - start_time);

            $.each(data, function(key, val) {

              // If JSON parsable, parse

              try {

                settings[key] = JSON.parse(val)

              } catch (error) {

                settings[key] = val;

              }

            });

            console.log(`Successfully pulled ${Object.keys(settings).length} settings from backend in ${pull_time['settings']}ms.`);

            // Function to check what was pulled from the backend in the console

            what = function(json) {

              console.log(json);

            };

            // Function for reloading the quote

            reloadQuote = function() {

              // If backend has no quotes, throw an error

              if (quotes.length === 0) {

                console.warn('There are no quotes!')
                throw new Error();

              }

              lastNum = localStorage.getItem('lastQuote');
              quoteNum = Math.floor(quotes.length * Math.random());

              // If all quotes are used and no repeats is enabled, start again

              if (usedQuotes.length === quotes.length && settings['no_repeats']) {

                usedQuotes = [];

              }

              // If MoodEngine trys to use the same quote twice, or one that has already been used, generate a new one

              while (lastNum == quoteNum || settings['no_repeats'] && usedQuotes.includes(quoteNum)) {

                quoteNum = Math.floor(quotes.length * Math.random());

              }

              // Add quote to used quotes, quote history and localStorage

              usedQuotes.push(quoteNum);
              quoteHistory.push(quoteNum);
              localStorage.setItem('lastQuote', quoteNum);

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

              lastNum = localStorage.getItem('lastColour');
              colourNum = Math.floor(colours.length * Math.random());

              // If MoodEngine trys to use the same colour twice, generate a new one

              while (lastNum == colourNum) {

                colourNum = Math.floor(colours.length * Math.random());

              }

              // Add colour to used colours, colour history and localStorage

              usedColours.push(colourNum);
              colourHistory.push(colourNum);
              localStorage.setItem('lastColour', quoteNum);

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


            // Set value for backend address input

            $('#backend_address').val(backend_address);

            // Add the text about the default to the current text

            $('.tooltipped').each(function() {

              let value = `${$(this).attr('data-tooltip')}<br>The default is ${settings[$(this).attr('data-setting')]}.`
              $(this).attr('data-tooltip', value);

              // Initialize the Materialize tooltip plugin

              $('.tooltipped').tooltip({
                html: true
              });

            });

            // Toggle auto reload when the button is clicked

            function toggleAutoReload() {

              let toggle = $('main').hasClass('manual-reload') ? 'Enabled' : 'Disabled';

              $('#auto-reload-icon').text($('#auto-reload-icon').text() === 'autorenew' ? 'close' : 'autorenew');
              $('main').toggleClass('manual-reload');
              Materialize.toast(`Auto Reload ${toggle}!`, settings['toast_interval']);

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
                $('#quote').addClass('scale-in');
                $('.preloader-wrapper').addClass('hide');
                $('#retry-button').hide();
                $('.fixed-action-btn').removeClass('hide');
                console.log('MoodEngine initialized.');

                // If an error, display/log it

              } catch (error) {

                var message = 'Failed to initialize MoodEngine.';
                engineError(message, message, 3);

              }

            }

            // Keyboard shortcuts

            $(document).keydown(function(e) {

              // If the user is not typing into an input

              if (!$('#settings-modal input:focus').length) {


                // Reload

                let reload_shortcuts = localStorage.getItem('reload_keys') ? JSON.parse(`[${localStorage.getItem('reload_keys')}]`) : settings['reload_keys'];

                if (reload_shortcuts.includes(e.which) && $('main').hasClass('manual-reload')) {

                  reloadEngine();

                }

                // Toggle auto reload

                let auto_reload_shortcuts = localStorage.getItem('auto_reload_keys') ? JSON.parse(`[${localStorage.getItem('auto_reload_keys')}]`) : settings['auto_reload_keys']

                if (auto_reload_shortcuts.includes(e.which)) {

                  toggleAutoReload();

                }

                // Open / close settings panel

                let settings_shortcuts = localStorage.getItem('settings_keys') ? JSON.parse(`[${localStorage.getItem('settings_keys')}]`) : settings['settings_keys'];

                if (settings_shortcuts.includes(e.which)) {

                  settingsOpen ? $('#settings-modal').modal('close') : $('#settings-modal').modal('open');

                }

                // Go back

                let back_shortcuts = localStorage.getItem('back_keys') ? JSON.parse(`[${localStorage.getItem('back_keys')}]`) : settings['back_keys'];

                if (back_shortcuts.includes(e.which) && $('main').hasClass('manual-reload') && usedQuotes.length > 1) {

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

              }

            });

          })

          // If pulling settings from backend fails, display/log the error

          .fail(function(data) {

            engineError('Failed to contact server. Try again later.', 'Failed to pull settings from backend.', '1c');

          });

        // Function to reload both quotes and colour

        reloadEngine = function() {

          if (!appError) {

            reloadQuote();
            reloadColour();

            // Set backpressed to false for going back
            backPressed = false;

          }

        }

        manualReload = function(text, colour) {

          $('#quote').text(text);
          $('body').css('background-color', `#${colour}`);

        }

        $('main').click(function() {

          // Reload when main element is clicked (which is most of DOM)

          if ($(this).hasClass('manual-reload')) {

            reloadEngine();

          }

        });

        // When user trys to save settings

        function saveSettings() {

          let local_settings = {};
          let has_input = true;

          $('.settings-input').each(function() {

            // Construct the object using values
            local_settings[$(this).attr('name')] = $(this).val();

            // Detect if input is blank

            if (!$(this).val()) {

              has_input = false;

            }

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

        }

        $('#save-settings-button').click(function() {

          saveSettings();

        });

        $('.settings-input').each(function() {

          $(this).keydown(function(e) {

            if (settings['save_settings_keys'].includes(e.which)) {

              saveSettings();

            }

          });

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

        // Toggle Advanced Settings

        $('#advanced-settings-button').click(function() {

          $(this).toggleClass('underline');
          $('#advanced-settings').slideToggle();

        });

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
