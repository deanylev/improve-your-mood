var what, appError, networkReported, start_time, reloadEngine, manualReload, text_reload_transitions_settings, text_reload_transitions_time;
var usedQuotes = [];
var usedColours = [];
var quoteHistory = [];
var colourHistory = [];
var platform = $('html').attr('data-platform');
var quotes = [];
var colours = [];
var settings = {};
var settingsOpen = false;
var pull_time = {};
var app_version = $('html').attr('data-app-version');

// Platform specific stuff

if (platform === 'web') {

  var version = window.location.href.includes('decreaseyourmood') ? 'Decrease' : 'Improve';

} else if (platform === 'app') {

  var version = $('html').attr('data-version');

}

var backend_address = localStorage.getItem('backend_address') || 'improveyourmood.xyz';

var full_backend_address = `http://${backend_address}/`;

$(document).ready(function() {

  // Put in correct text / year

  $('title').text(`${version} Your Mood`);
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  let meta_desc = version === 'Improve' ? 'Gives you randomly chosen compliments across randomly chosen beautiful colours to improve your mood!' : 'Gives you randomly chosen insults across randomly chosen beautiful colours to decrease your mood!'
  $('meta[name="description"]').attr('content', meta_desc)

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

  // Do it on resize too

  $(window).resize(function() {

    $('.js-margin').css('margin-top', $(document).height() / 4.5);

  });

});

// Function for displaying and logging errors

function engineError(display, log, code) {

  // If network connection is detected

  if (navigator.onLine) {

    appError = true;
    $('.coloured').css('background-color', 'black');
    $('meta[name="theme-color"]').attr('content', 'black');
    $('#quote').text(display);
    $('#quote').addClass('scale-in');
    $('.preloader-wrapper').addClass('hide');
    $('#error-code').text(`Error code ${code}`);
    console.error(log);

    if (localStorage.getItem('backend_address')) {

      $('#reset-backend-address').removeClass('hide');

    }

  } else if (!networkReported) {

    networkReported = true;
    $('#quote').text('You are not connected to the internet.');
    $('#quote').addClass('scale-in');
    $('.preloader-wrapper').addClass('hide');
    $('#retry-button').removeClass('hide');
    console.log('No internet connection.');

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

        // Pull settings from backend

        start_time = performance.now();

        console.log('Pulling settings from backend...');

        $.getJSON(`${full_backend_address}settings_serializer.php`)

          // Move on to next step

          .done(function(data) {

            pull_time['settings'] = Math.ceil(performance.now() - start_time);

            $.each(data, function(key, val) {

              let object = {};

              $.each(val, function(key, val) {

                try {

                  object[key] = JSON.parse(val);

                } catch(error) {

                  object[key] = val;

                }

              });

              settings[key] = object;

            });

            console.log(`Successfully pulled ${Object.keys(settings).length} settings from backend in ${pull_time['settings']}ms.`);

            // Check app version

            if (platform === 'app' && settings['app_update_reminder']['value'] && settings['app_version']['value'] !== app_version) {

              Materialize.toast(settings['app_update_reminder']['description'], settings['toast_interval']['value']);

            }

            // Initialize modal plugin

            $('#settings-modal').modal({
              ready: function(modal, trigger) {

                settingsOpen = true;

              },
              complete: function() {

                settingsOpen = false;

                $('.settings-input').each(function() {

                  let setting = $(this).attr('name');

                  // For some reason the select elements return undefined which breaks stuff, so this is a crappy workaround

                  try {

                    let value = localStorage.getItem(setting) || settings[setting]['value'];
                    $(this).is('select') ? $(this).val(JSON.stringify(value)) : $(this).val(value);
                    $(this).is('input') ? $(this).parent().find('label').addClass('active') : '';
                    $('select').material_select();

                  } catch (error) {

                    return;

                  }

                });

              }
            });

            // Function to check what was pulled from the backend in the console

            what = function(json) {

              console.log(json);

            };

            text_reload_transitions_settings = localStorage.getItem('text_reload_transitions') ? JSON.parse(localStorage.getItem('text_reload_transitions')) : settings['text_reload_transitions']['value'];
            text_reload_transition_time = localStorage.getItem('text_reload_transition_time') ? JSON.parse(localStorage.getItem('text_reload_transition_time')) : settings['text_reload_transition_time']['value'];

            // Function for reloading the quote

            reloadQuote = function() {

              // If backend has no quotes, throw an error

              if (quotes.length === 0) {

                console.warn('There are no quotes!')
                throw new Error();

              }

              let lastNum = localStorage.getItem('lastQuote');
              quoteNum = Math.floor(quotes.length * Math.random());

              // If all quotes are used and no repeats is enabled, start again

              if (usedQuotes.length === quotes.length && settings['no_repeats']['value']) {

                usedQuotes = [];

              }

              // If MoodEngine trys to use the same quote twice, or one that has already been used, generate a new one

              while (lastNum == quoteNum || settings['no_repeats']['value'] && usedQuotes.includes(quoteNum)) {

                quoteNum = Math.floor(quotes.length * Math.random());

              }

              // Add quote to used quotes, quote history and localStorage

              usedQuotes.push(quoteNum);
              quoteHistory.push(quoteNum);
              localStorage.setItem('lastQuote', quoteNum);

              let quote = quotes[quoteNum];

              // Display quote on the text element

              if (text_reload_transitions_settings) {

                $('#quote').fadeOut(text_reload_transition_time / 2, function() {

                  $(this).text(quote).fadeIn(text_reload_transition_time / 2);

                });

              } else {

                $('#quote').text(quote);

              }

            };

            // Function for reloading the text

            reloadColour = function() {

              // If backend has no colours, throw an error

              if (colours.length === 0) {

                console.warn('There are no colours!')
                throw new Error();

              }

              let lastNum = localStorage.getItem('lastColour');
              colourNum = Math.floor(colours.length * Math.random());

              // If MoodEngine trys to use the same colour twice, generate a new one

              while (lastNum == colourNum) {

                colourNum = Math.floor(colours.length * Math.random());

              }

              // Add colour to used colours, colour history and localStorage

              usedColours.push(colourNum);
              colourHistory.push(colourNum);
              localStorage.setItem('lastColour', colourNum);

              let colour = colours[colourNum];

              // Apply colour to background

              $('.coloured').css('background-color', `#${colour}`);
              $('meta[name="theme-color"]').attr('content', `#${colour}`);

            };

            // Auto reload

            var time_setting = localStorage.getItem('reload_interval') || settings['reload_interval']['value'];

            window.setInterval(function() {

              if (!notAutoReloading()) {

                reloadEngine('Auto');
                console.log(`Auto reloaded after ${time_setting}ms.`);

              }


            }, time_setting);

            // Set the correct values in the settings inputs

            $('.settings-input').each(function() {

              let setting = $(this).attr('name');

              // For some reason the select elements return undefined which breaks stuff, so this is a crappy workaround

              try {

                let value = localStorage.getItem(setting) || settings[setting]['value'];
                $(this).is('select') ? $(this).val(JSON.stringify(value)) : $(this).val(value);
                $(this).is('input') ? $(this).parent().find('label').addClass('active') : '';
                $('select').material_select();

              } catch (error) {

                return;

              }

            });


            // Set value for backend address input

            $('#backend_address').val(backend_address);

            // Add defaults to tooltips

            $('.tooltipped').each(function() {

              let value = `${settings[$(this).attr('data-setting')]['description']}.<br>The default is ${settings[$(this).attr('data-setting')]['value']}.`
              $(this).attr('data-tooltip', value);

              // Initialize the Materialize tooltip plugin

              $('.tooltipped').tooltip({
                html: true
              });

            });

            // Toggle auto reload when the button is clicked

            function toggleAutoReload() {

              let toggle = notAutoReloading() ? 'Enabled' : 'Disabled';
              let icon_text = notAutoReloading() ? 'close' : 'autorenew';
              let icon = $('#toggle-auto-reload').find('i');

              icon.text(icon_text);
              $('#go-back-button').attr('disabled', notAutoReloading());
              $('main').toggleClass('manual-reload');
              Materialize.toast(`Auto Reload ${toggle}!`, settings['toast_interval']['value']);

            }

            $('#toggle-auto-reload').click(function() {

              toggleAutoReload();

            });

            // Go back when the button is clicked

            function goBack() {

              if (notAutoReloading() && quoteHistory.length > 1) {

                quoteNum = quoteHistory.length - 2;
                quoteHistory.pop();
                localStorage.setItem('lastQuote', quoteHistory[quoteNum]);

                colourNum = colourHistory.length - 2;
                colourHistory.pop();
                localStorage.setItem('lastColour', colourHistory[colourNum]);

                let quote = quotes[quoteHistory[quoteNum]];
                let colour = colours[colourHistory[colourNum]];

                if (text_reload_transitions_settings) {

                  $('#quote').fadeOut(text_reload_transition_time / 2, function() {

                    $(this).text(quote).fadeIn(text_reload_transition_time / 2);

                  });

                } else {

                  $('#quote').text(quote);

                }

                $('.coloured').css('background-color', `#${colour}`);
                $('meta[name="theme-color"]').attr('content', `#${colour}`);

              }

            }

            $('#go-back-button').click(function() {

              goBack();

            });

            // Reload transitions

            let colour_reload_transitions_settings = localStorage.getItem('colour_reload_transitions') ? JSON.parse(localStorage.getItem('colour_reload_transitions')) : settings['colour_reload_transitions']['value'];
            let colour_reload_transition_time = localStorage.getItem('colour_reload_transition_time') ? JSON.parse(localStorage.getItem('colour_reload_transition_time')) : settings['colour_reload_transition_time']['value'];

            if (colour_reload_transitions_settings) {

              $('.coloured').css('transition', `${colour_reload_transition_time}ms ease-out`);

            }

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

            // Touch / click gestures

            var hammertime = new Hammer($('html')[0]);

            hammertime.on('swipeleft', function(ev) {

              reloadEngine();

            });

            hammertime.on('swiperight', function(ev) {

              goBack();

            });

            $('.container').click(function(e) {

              reloadEngine();

            });

            // Keyboard shortcuts

            $(document).keydown(function(e) {

              // If the user is not typing into an input

              if (!$('#settings-modal input:focus').length) {

                // Reload

                let reload_shortcuts = localStorage.getItem('reload_keys') ? JSON.parse(`[${localStorage.getItem('reload_keys')}]`) : settings['reload_keys']['value'];

                if (reload_shortcuts.includes(e.which) && !settingsOpen) {

                  reloadEngine();

                }

                // Toggle auto reload

                let auto_reload_shortcuts = localStorage.getItem('auto_reload_keys') ? JSON.parse(`[${localStorage.getItem('auto_reload_keys')}]`) : settings['auto_reload_keys']['value'];

                if (auto_reload_shortcuts.includes(e.which) && !settingsOpen) {

                  toggleAutoReload();

                }

                // Open / close settings panel

                let settings_shortcuts = localStorage.getItem('settings_keys') ? JSON.parse(`[${localStorage.getItem('settings_keys')}]`) : settings['settings_keys']['value'];

                if (settings_shortcuts.includes(e.which)) {

                  settingsOpen ? $('#settings-modal').modal('close') : $('#settings-modal').modal('open');

                }

                // Go back

                let back_shortcuts = localStorage.getItem('back_keys') ? JSON.parse(`[${localStorage.getItem('back_keys')}]`) : settings['back_keys']['value'];

                if (back_shortcuts.includes(e.which) && !settingsOpen && usedQuotes.length > 1) {

                  goBack();

                }

              }

            });

          })

          // If pulling settings from backend fails, display/log the error

          .fail(function(data) {

            engineError('Failed to contact server. Try again later.', 'Failed to pull settings from backend.', '1c');

          });

        // Function to reload both quotes and colour

        function notAutoReloading() {

          return $('main').hasClass('manual-reload');

        }

        reloadEngine = function(method) {

          if (!appError && (notAutoReloading() || method === 'Auto')) {

            reloadQuote();
            reloadColour();

            // Log quote/colour in console (for fun)

            if (settings['extra_logging']['value'].includes('reload') && platform === 'web') {

              console.log(`%c${quotes[quoteNum]}`, `padding: 2px 5px; font-size: 20px; font-family: 'Oxygen'; color: white; background-color: #${colours[colourNum]}`);

            }

          }

        }

        manualReload = function(text, colour) {

          if (text_reload_transitions_settings) {

            $('#quote').fadeOut(text_reload_transition_time / 2, function() {

              $(this).text(text).fadeIn(text_reload_transition_time / 2);

            });

          } else {

            $('#quote').text(text);

          }

          $('.coloured').css('background-color', `#${colour}`);
          $('meta[name="theme-color"]').attr('content', `#${colour}`);

        }

        // Set all settings to default

        $('.set-all-default').click(function() {

          let lastQuote = localStorage.getItem('lastQuote');
          let lastColour = localStorage.getItem('lastColour');

          localStorage.clear();

          localStorage.setItem('lastQuote', lastQuote);
          localStorage.setItem('lastColour', lastColour);

          window.location.reload();

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

              //has_input = false;

            }

          });

          // If all inputs are not blank

          if (has_input) {

            delete local_settings[undefined];

            try {

              $.each(local_settings, function(key, val) {

                // If the set value is the same as the default, just remove it from localStorage and use backend value

                if (val === settings[key]['value'] || val === JSON.stringify(settings[key]['value'])) {

                  localStorage.removeItem(key);

                  // Otherwise set it in localStorage

                } else {

                  localStorage.setItem(key, val);

                }

              });

              // Reload the page for settings to come into effect

              Materialize.toast('Settings Saved!', settings['toast_interval']['value']);
              window.location.reload();

              // Catch any unexpected errors and display/log them

            } catch (error) {

              Materialize.toast('Unable To Save Settings. An Error Occured.', settings['toast_interval']['value']);
              console.error(`Couldn't save settings. Error: ${error}.`);

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

            if (settings['save_settings_keys']['value'].includes(e.which)) {

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
