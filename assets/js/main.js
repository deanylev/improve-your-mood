var appError, startTime, settingsOpen, lastNum, totalTime;
var quotes = [];
var colours = [];
var usedQuotes = [];
var usedColours = [];
var quoteHistory = [];
var colourHistory = [];
var moodEngine = {};
var settings = {};
var fullSettings = {};
var pullTime = {};
var platform = $('html').attr('data-platform');
var appVersion = $('html').attr('data-app-version');
var backendAddress = localStorage.getItem('backend_address') || 'improveyourmood.xyz';
var fullBackendAddress = `http://${backendAddress}/`;

// Platform specific stuff

if (platform === 'web') {

  var version = window.location.href.includes('decreaseyourmood') ? 'Decrease' : 'Improve';

} else {

  var version = $('html').attr('data-version');

}

$(window).on('error', function(error) {

  let log = typeof(error) === 'string' ? error : null;

  moodEngine.error(null, log);

});

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

  // Clear backend address

  moodEngine.resetBackendAddress = function() {

    localStorage.removeItem('backend_address');
    window.location.reload();

  };

  $('#reset-backend-address').click(function() {

    moodEngine.resetBackendAddress();

  });

  // Calculate proper top margin for certain elements

  $('.js-margin').css('margin-top', $(document).height() / 4.5);

  // Do it on resize too

  $(window).resize(function() {

    $('.js-margin').css('margin-top', $(document).height() / 4.5);

  });

  // Button order in localStorage seems to break a lot...

  if (localStorage.getItem('button_order') === 'null') {

    localStorage.removeItem('button_order');

  }

});

// Function for displaying and logging errors

moodEngine.error = function(display, log, code, type) {

  $('.coloured').css('background-color', 'black');
  $('.theme-text').css('color', 'white');
  $('meta[name="theme-color"]').attr('content', 'black');
  $('#quote').addClass('scale-in');
  $('.preloader-wrapper').addClass('hide');
  $('.fixed-action-btn').addClass('hide');

  // If network connection is detected

  if (navigator.onLine) {

    if (!display) {

      display = 'An error occured.';

    }

    if (!log) {

      log = 'An error occured.';

    }

    if (code) {

      $('#error-message').text(`${log} (${code})`);

    }
    $('#quote').text(display);

    console.error(log);

    if (type === 'backend' && localStorage.getItem('backend_address')) {

      $('#reset-backend-address').removeClass('hide');

    }

  } else {

    $('#quote').text('You are not connected to the internet.');
    $('#retry-button').removeClass('hide');
    console.log('\nNo internet connection.');

  }

  appError = true;

};

// Pull quotes from backend

startTime = performance.now();
totalTime = performance.now();

console.log(`%c${version} Your Mood 6`, 'font-family: "Oxygen"; font-size: 20px;');
console.log('――――――――――――――――――――――――――――――')
console.log(`Pulling from: ${fullBackendAddress}`);

console.log('\nPulling quotes from backend...');

$.getJSON(`${fullBackendAddress + version.toLowerCase()}_quote_serializer.php`).done((data) => {

  pullTime['quotes'] = Math.ceil(performance.now() - startTime);

  $.each(data, function(key, val) {

    quotes.push(val);

  });

  console.log(`Successfully pulled ${quotes.length} quotes from backend in ${pullTime['quotes']}ms.`);

  // Pull colours from backend

  startTime = performance.now();

  console.log('\nPulling colours from backend...');

  $.getJSON(`${fullBackendAddress}colour_serializer.php`).done((data) => {

    pullTime['colours'] = Math.ceil(performance.now() - startTime);

    $.each(data, function(key, val) {

      colours.push(val);

    });

    console.log(`Successfully pulled ${colours.length} colours from backend in ${pullTime['colours']}ms.`);

    var quoteNum;
    var colourNum;

    // Pull settings from backend

    startTime = performance.now();

    console.log('\nPulling settings from backend...');

    $.getJSON(`${fullBackendAddress}settings_serializer.php`).done((data) => {

      pullTime['settings'] = Math.ceil(performance.now() - startTime);

      $.each(data, function(key, val) {

        let object = {};

        $.each(val, function(key, val) {

          try {

            object[key] = JSON.parse(val);

          } catch (error) {

            object[key] = val;

          }

        });

        settings[key] = object;

      });

      console.log(`Successfully pulled ${Object.keys(settings).length} settings from backend in ${pullTime['settings']}ms.`);

      // Construct settings object from backend or local

      moodEngine.setSettings = function(method, toast) {

        $.each(settings, function(key, val) {

          if (localStorage.getItem(key)) {

            try {

              fullSettings[key] = JSON.parse(localStorage.getItem(key));

            } catch (error) {

              try {

                fullSettings[key] = JSON.parse(`[${localStorage.getItem(key)}]`);

              } catch (error) {

                fullSettings[key] = localStorage.getItem(key);

              }

            }

          } else {

            fullSettings[key] = settings[key]['value'];

          }

        });

        // Theme colour

        $('.theme-text').css('cssText', `color: ${fullSettings['theme_colour']} !important`);

        // Reload transitions

        if (fullSettings['colour_reload_transitions']) {

          $('.coloured').css('transition', `${fullSettings['colour_reload_transition_time']}ms ease-out`);

        } else {

          $('.coloured').css('transition', 'none')

        }

        // Touch / click gestures

        $('html').hammer().off();

        $('html').hammer().on(fullSettings['reverse_swipe_direction'] ? 'swiperight' : 'swipeleft', function(ev) {

          let direction = fullSettings['reverse_swipe_direction'] ? 'right' : 'left';
          console.log(`Swiped ${direction} to reload.`);
          moodEngine.reload();

        });

        $('html').hammer().on(fullSettings['reverse_swipe_direction'] ? 'swipeleft' : 'swiperight', function(ev) {

          let direction = fullSettings['reverse_swipe_direction'] ? 'left' : 'right';
          console.log(`Swiped ${direction} to rewind.`);
          moodEngine.rewind();

        });

        // Clear array of menu buttons if the amount of buttons from server is different

        if (fullSettings['button_order'] && settings['button_order'] && fullSettings['button_order'].length !== settings['button_order']['value'].length) {

          localStorage.removeItem('button_order');

        }

        // Keyboard shortcuts

        if (platform === 'web') {

          Mousetrap.reset();

          // Reload & Save Settings (because they share keys)

          if (fullSettings['reload_keys'] && typeof(fullSettings['reload_keys']) === 'object') {

            Mousetrap.bind(fullSettings['reload_keys'], function(e, combo) {

              if (!appError) {

                if (!settingsOpen) {

                  moodEngine.reload();

                } else if ($('#settings-modal input:focus').length && fullSettings['save_settings_keys'].includes(combo)) {

                  moodEngine.saveSettings();

                }

              }

            });

          }

          // Rewind

          if (fullSettings['back_keys'] && typeof(fullSettings['back_keys']) === 'object') {

            Mousetrap.bind(fullSettings['back_keys'], function(e) {

              if (!appError && !settingsOpen) {

                moodEngine.rewind();

              }

            });

          }

          // Rewind

          if (fullSettings['full_rewind_keys'] && typeof(fullSettings['full_rewind_keys']) === 'object') {

            Mousetrap.bind(fullSettings['full_rewind_keys'], function(e) {

              if (!appError && !settingsOpen) {

                moodEngine.fullRewind();

              }

            });

          }

          // Toggle Auto Reload

          if (fullSettings['auto_reload_keys'] && typeof(fullSettings['auto_reload_keys']) === 'object') {

            Mousetrap.bind(fullSettings['auto_reload_keys'], function(e) {

              if (!appError && !settingsOpen) {

                moodEngine.toggleAutoReload();

              }

            });

          }

          // Toggle Button Menu

          if (fullSettings['menu_keys'] && typeof(fullSettings['menu_keys']) === 'object') {

            Mousetrap.bind(fullSettings['menu_keys'], function(e) {

              if (!appError && !settingsOpen) {

                let fabOpen = $('.fixed-action-btn').hasClass('active');

                fabOpen ? $('.fixed-action-btn').closeFAB() : $('.fixed-action-btn').openFAB();

              }

            });

          }

          // Toggle Settings Panel

          if (fullSettings['settings_keys'] && typeof(fullSettings['settings_keys']) === 'object') {

            Mousetrap.bind(fullSettings['settings_keys'], function(e) {

              if (!appError && !$('#settings-modal input:focus').length) {

                settingsOpen ? $('#settings-modal').modal('close') : $('#settings-modal').modal('open');

              }

            });

          }

        }

        if (method !== 'initial') {

          $('#settings-modal').modal('close');
          Materialize.toast(toast, fullSettings['toast_interval']);

          if (fullSettings['require_settings_reload'] || fullSettings['backend_address'] !== backendAddress) {

            window.location.reload();

          }

        }

      };

      moodEngine.setSettings('initial');

      // Check app version

      if (platform === 'app' && fullSettings['app_update_reminder'] && fullSettings['app_version'] !== appVersion) {

        Materialize.toast(settings['app_update_reminder']['description'], fullSettings['toast_interval']);

      }

      // Set inputs in modal

      function setInputs() {

        $('.settings-input:not(.select-wrapper)').each(function() {

          let setting = $(this).attr('name');
          let value = fullSettings[setting];

          $(this).is('select') || typeof(value) === 'object' ? $(this).val(JSON.stringify(value)) : $(this).val(value);
          $(this).is('input') ? $(this).parent().find('label').addClass('active') : '';
          $(this).removeClass('invalid');
          $('select').material_select();

          if ($(this).hasClass('chips')) {

            let name = $(this).attr('name');
            let values = [];

            $.each(fullSettings[name], function(key, val) {

              let object = {
                tag: val
              }

              values.push(object);

            });

            // Materialize chips
            $(`div[name="${name}"]`).material_chip({
              data: values
            });

          }

        });

      }

      // Initialize modal plugin

      $('#settings-modal').modal({
        ready: function(modal, trigger) {

          // Scroll to the top of the modal

          if (fullSettings['scroll_settings'] && $('#settings-modal').scrollTop) {

            $('#settings-modal').animate({
              scrollTop: 0
            }, 200);

          }

          settingsOpen = true;

        },
        complete: function() {

          settingsOpen = false;

          setInputs();

        }
      });

      // Build button menu

      var menuHTML = '';

      if (!fullSettings['button_order']) {

        console.warn('Server has no button order, falling back to defaults...');
        fullSettings['button_order'] = ['autoreload', 'settings', 'rewind'];

      }

      var hasUserSettings = false;

      $.each(settings, function(key, val) {

        if (val['user']) {

          hasUserSettings = true;

        }

      });

      $.each(fullSettings['button_order'], function(key, val) {

        switch (val) {

          case 'autoreload':
            var html = '<li data-button="autoreload"><a class="btn-floating waves-effect transparent" id="toggle-auto-reload"><i class="material-icons theme-text" data-icon="autoreload" data-default="autorenew"></i></a></li>';
            break;
          case 'settings':
            let hidden = hasUserSettings ? '' : 'hide';
            var html = `<li data-button="settings" class="${hidden}"><a class="btn-floating waves-effect transparent" id="settings-button"><i class="material-icons theme-text" data-icon="settings" data-default="settings"></i></a></li>`;
            break;
          case 'rewind':
            var html = '<li data-button="rewind"><a class="btn-floating waves-effect transparent disabled" id="go-back-button"><i class="material-icons theme-text" data-icon="rewind" data-default="skip_previous"></i></a></li>';
            break;
          default:
            console.warn(`Unknown value '${val}' in button order, skipping...`);

        }

        menuHTML += html;

      });

      $('#button-menu').html(menuHTML);

      // Set settings again to set proper colours for button menu

      moodEngine.setSettings('initial');

      // Initialize sortable menu

      if (settings['button_order']) {

        $('#button-menu').sortable({
          stop: function(event, ui) {

            var array = $('#button-menu').sortable('toArray', {
              attribute: 'data-button'
            });

            localStorage.setItem('button_order', JSON.stringify(array));

          }
        });

      }

      // Set correct icons

      if (!fullSettings['button_icons']) {

        console.warn('Server has no icons, falling back to defaults...');

      }

      $('.material-icons').each(function() {

        if (fullSettings['button_icons']) {

          var icon = fullSettings['button_icons'][$(this).attr('data-icon')];

        } else {

          var icon = $(this).attr('data-default');

        }

        $(this).text(icon);

      });

      // Construct settings panel

      var fullHTML = '';
      var fullAdvancedHTML = '';

      $.each(settings, function(key, val) {

        if (val['user']) {

          if (val['input'] === 'select') {

            var input = `
                  <select class="settings-input" name="${key}">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  `;

            var label = `
                  <label>${val['label']}</label>
                  `;

          } else {

            if (val['input'] === 'chips') {

              var input = `<div class="chips left-align settings-input" name="${key}"></div>`;

            } else {

              var input = `<input type="${val['input']}" name="${key}" class="settings-input mousetrap" id="${key}">`;

            }

            var label = `<label for="${key}">${val['label']}</label>`;

          }

          var mobile = val['mobile'] ? '' : 'hide-on-med-and-down';

          let html = `
                <div class="row ${mobile}">
                  <div class="input-field col s12">
                    ${input}
                    ${label}
                    <a class="black-text settings-link default-button" data-setting="${key}"><b>Set to Default</b></a>
                    <br>
                    <span class="tooltipped" data-setting="${key}" data-position="bottom" data-delay="50">What's this?</span>
                  </div>
                </div>
                `;

          val['advanced'] ? fullAdvancedHTML += html : fullHTML += html;

        }

      });

      $('#settings-form').prepend(fullHTML);

      if (fullAdvancedHTML) {

        $('#advanced-settings-wrapper').removeClass('hide');
        $('#advanced-settings').html(fullAdvancedHTML);

      }

      // Settings button

      $('#settings-button').click(function(e) {

        if (!appError) {

          e.shiftKey ? moodEngine.setAllDefault() : $('#settings-modal').modal('open');

        }

      });

      // Set desired settings to default using the attr on the default button

      $('.default-button').click(function() {

        let setting = $(this).attr('data-setting');
        localStorage.removeItem(setting);
        moodEngine.setSettings(null, `Set ${settings[setting]['label']} to Default!`);

      });

      // Set the correct values in the settings inputs on load

      setInputs();

      // Add defaults to tooltips

      $('.tooltipped').each(function() {

        let value = `${settings[$(this).attr('data-setting')]['description']}.<br>The default is ${settings[$(this).attr('data-setting')]['value']}.`
        $(this).attr('data-tooltip', value);

        // Initialize the Materialize tooltip plugin

        $('.tooltipped').tooltip({
          html: true
        });

      });

      // Auto reload

      function autoReload() {

        if (!fullSettings['reload_interval'] && fullSettings['reload_interval'] !== 0) {

          fullSettings['reload_interval'] = 3000;

        }

        setTimeout(function() {

          if (!moodEngine.notAutoReloading() && !appError) {

            moodEngine.reload('Auto');
            console.log(`\nAuto reloaded after ${fullSettings['reload_interval']}ms.`);

          }

          autoReload();

        }, fullSettings['reload_interval']);

      }

      autoReload();

      // Allows other functions to check if currently auto reloading

      moodEngine.notAutoReloading = function() {

        return $('main').hasClass('manual-reload');

      };

      // Toggle auto reload when the button is clicked

      moodEngine.toggleAutoReload = function() {

        if (!appError) {

          let toggle = moodEngine.notAutoReloading() ? 'Enabled' : 'Disabled';
          let icon_text = moodEngine.notAutoReloading() ? 'close' : 'autorenew';
          let icon = $('#toggle-auto-reload i');

          if (moodEngine.notAutoReloading()) {

            $('#go-back-button').addClass('disabled');

          } else if (quoteHistory.length > 1) {

            $('#go-back-button').removeClass('disabled');

          }

          icon.text(icon_text);
          $('main').toggleClass('manual-reload');
          Materialize.toast(`Auto Reload ${toggle}!`, fullSettings['toast_interval']);

        }

      };

      $('#toggle-auto-reload').click(function(e) {

        e.shiftKey ? moodEngine.switchVersion() : moodEngine.toggleAutoReload();

      });

      // Go back when the button is clicked

      moodEngine.rewind = function() {

        if (moodEngine.notAutoReloading() && quoteHistory.length > 1 && !appError) {

          quoteNum = quoteHistory.length - 2;
          quoteHistory.pop();
          localStorage.setItem('lastQuote', quoteHistory[quoteNum]);

          colourNum = colourHistory.length - 2;
          colourHistory.pop();
          localStorage.setItem('lastColour', colourHistory[colourNum]);

          let quote = quotes[quoteHistory[quoteNum]];
          let colour = colours[colourHistory[colourNum]];

          if (fullSettings['text_reload_transitions']) {

            $('#quote').fadeOut(fullSettings['text_reload_transition_time'] / 2, function() {

              $(this).text(quote).fadeIn(fullSettings['text_reload_transition_time'] / 2);

            });

          } else {

            $('#quote').text(quote);

          }

          $('.coloured').css('background-color', `#${colour}`);
          $('meta[name="theme-color"]').attr('content', `#${colour}`);

        }

        if (quoteHistory.length === 1 || !moodEngine.notAutoReloading()) {

          $('#go-back-button').addClass('disabled');

        }

      };

      $('#go-back-button').click(function(e) {

        e.shiftKey ? moodEngine.fullRewind() : moodEngine.rewind();

      });

      // Go to starting quote & colour

      moodEngine.fullRewind = function() {

        if (quoteHistory.length > 1) {

          let quote = quoteHistory[0];
          let colour = colourHistory[0];

          usedQuotes = [];
          quoteHistory = [];
          colourHistory = [];

          usedQuotes[0] = quote;
          quoteHistory[0] = quote;
          colourHistory[0] = colour;

          if (fullSettings['text_reload_transitions']) {

            $('#quote').fadeOut(fullSettings['text_reload_transition_time'] / 2, function() {

              $(this).text(quotes[quote]).fadeIn(fullSettings['text_reload_transition_time'] / 2);

            });

          } else {

            $('#quote').text(quotes[quote]);

          }

          $('.coloured').css('background-color', `#${colours[colour]}`);

          $('#go-back-button').addClass('disabled');

        }

      };

      // Reload the engine (generate new quote/colour)

      moodEngine.reload = function(method) {

        if (!appError && (moodEngine.notAutoReloading() || method === 'Auto')) {

          // Reload the quote

          // If backend has no quotes, throw an error

          if (quotes.length < 2) {

            throw new Error('There are no quotes.');

          }

          // Clear error message in case there is one

          $('#error-message').empty();

          lastNum = localStorage.getItem('lastQuote');
          quoteNum = Math.floor(quotes.length * Math.random());

          // If all quotes are used and no repeats is enabled, start again

          if (usedQuotes.length === quotes.length && fullSettings['no_repeats']) {

            usedQuotes = [];

          }

          // If MoodEngine trys to use the same quote twice, or one that has already been used, generate a new one

          while (lastNum == quoteNum || fullSettings['no_repeats'] && usedQuotes.includes(quoteNum)) {

            quoteNum = Math.floor(quotes.length * Math.random());

          }

          // Add quote to used quotes, quote history and localStorage

          usedQuotes.push(quoteNum);
          quoteHistory.push(quoteNum);
          localStorage.setItem('lastQuote', quoteNum);

          let quote = quotes[quoteNum];

          // Display quote on the text element

          if (fullSettings['text_reload_transitions']) {

            $('#quote').fadeOut(fullSettings['text_reload_transition_time'] / 2, function() {

              $(this).text(quote).fadeIn(fullSettings['text_reload_transition_time'] / 2);

            });

          } else {

            $('#quote').text(quote);

          }

          // Reload the colour

          // If backend has no colours, throw an error

          if (colours.length < 2) {

            throw new Error('There are no colours.');

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
          localStorage.setItem('lastColour', colourNum);

          let colour = colours[colourNum];

          // Apply colour to background

          $('.coloured').css('background-color', `#${colour}`);
          $('meta[name="theme-color"]').attr('content', `#${colour}`);

          $('.fixed-action-btn').removeClass('hide');

          if (method !== 'Auto') {

            $('#go-back-button').removeClass('disabled');

          }

          // Log quote/colour in console (for fun)

          if (fullSettings['extra_logging'] && fullSettings['extra_logging'].includes('reload') && platform === 'web') {

            console.log(`%c${quotes[quoteNum]}`, `padding: 2px 5px; font-size: 20px; font-family: 'Oxygen'; color: white; background-color: #${colours[colourNum]}`);

          }

        }

      };

      // Try to initialize the MoodEngine if there are no errors

      if (!appError) {

        console.log('\nInitializing MoodEngine...');

        try {

          moodEngine.reload('Auto');
          $('#quote').addClass('scale-in');
          $('.preloader-wrapper').addClass('hide');
          $('#retry-button').hide();
          $('.fixed-action-btn').removeClass('hide');
          console.log('MoodEngine initialized.');
          let totalLoadTime = Math.ceil(performance.now() - totalTime);
          console.log(`\nTotal load time: ${totalLoadTime}ms.`);

          // If an error, display/log it

        } catch (error) {

          error = error.toString();
          moodEngine.error('Failed to initialize MoodEngine.', error, 3);

        }

      }

      $('.container').click(function(e) {

        moodEngine.reload();

      });

      // Manually choose the text and colour from the console

      moodEngine.manualReload = function(text, colour) {

        if (fullSettings['text_reload_transitions']) {

          $('#quote').fadeOut(fullSettings['text_reload_transition_time'] / 2, function() {

            $(this).text(text).fadeIn(fullSettings['text_reload_transition_time'] / 2);

          });

        } else {

          $('#quote').text(text);

        }

        $('.coloured').css('background-color', `#${colour}`);
        $('meta[name="theme-color"]').attr('content', `#${colour}`);

      };

      // Set all settings to default

      moodEngine.setAllDefault = function() {

        let lastQuote = localStorage.getItem('lastQuote');
        let lastColour = localStorage.getItem('lastColour');
        let buttonOrder = localStorage.getItem('button_order');
        let backendAddress = localStorage.getItem('backend_address');

        localStorage.clear();

        localStorage.setItem('lastQuote', lastQuote);
        localStorage.setItem('lastColour', lastColour);
        localStorage.setItem('button_order', buttonOrder);

        if (backendAddress && !$('#advanced-settings-button').hasClass('underline')) {

          localStorage.setItem('backend_address', backendAddress);

        }

        moodEngine.setSettings(null, 'Set All Settings to Default!');

      };

      $('.set-all-default').click(function() {

        moodEngine.setAllDefault();

      });

      // When user trys to save settings

      moodEngine.saveSettings = function() {

        let local_settings = {};
        let empty_inputs = [];

        $('.settings-input:not(.select-wrapper)').each(function() {

          // Construct the object using values

          if ($(this).hasClass('chips')) {

            let array = [];

            $.each($(this).material_chip('data'), function(key, val) {

              array.push(val.tag);

            });

            local_settings[$(this).attr('name')] = JSON.stringify(array);

          } else {

            local_settings[$(this).attr('name')] = $(this).val();

          }

          // Detect if input is blank

          if (!$(this).val() || $(this).val() === 'null' || $(this).val().indexOf(' ') >= 0 || $(this).hasClass('chips') && !$(this).material_chip('data').length) {

            $(this).addClass('invalid');

            empty_inputs.push(` ${$(this).parent().find('label').text()}`);

          } else {

            $(this).removeClass('invalid');

          }

        });

        // If all inputs are not blank

        if (!empty_inputs.length) {

          try {

            $.each(local_settings, function(key, val) {

              // If the set value is the same as the default, just remove it from localStorage and use backend value

              if (val === settings[key]['value'] || val === JSON.stringify(settings[key]['value']) || `[${val}]` === JSON.stringify(settings[key]['value'])) {

                localStorage.removeItem(key);

                // Otherwise set it in localStorage

              } else {

                localStorage.setItem(key, val);

              }

            });

            // Set settings for new ones to come into effect

            moodEngine.setSettings(null, 'Settings Saved!');

            // Catch any unexpected errors and display/log them

          } catch (error) {

            Materialize.toast('Unable to Save Settings. An Error Occurred.', fullSettings['toast_interval']);
            console.error(`Couldn't save settings. Error: ${error}.`);

          }

          // Close the modal no matter what

          $('#settings-modal').modal('close');

        } else {

          if (empty_inputs.length === 1) {

            Materialize.toast(`${empty_inputs} Contains Spaces.`, fullSettings['toast_interval']);

          } else {

            Materialize.toast(`${empty_inputs.length} Fields Contain Spaces.`, fullSettings['toast_interval']);

          }

        }

      };

      $('#save-settings-button').click(function(e) {

        moodEngine.saveSettings();

        e.shiftKey ? window.location.reload() : '';

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

      // Switch Version

      moodEngine.switchVersion = function() {

        version = version === 'Improve' ? 'Decrease' : 'Improve';
        quotes = [];
        quoteHistory = [];
        colourHistory = [];
        usedQuotes = [];

        startTime = performance.now();

        console.log(`\nSwitching version to ${version}...`);

        appError = true;

        $.getJSON(`${fullBackendAddress + version.toLowerCase()}_quote_serializer.php`).done((data) => {

          $.each(data, function(key, val) {

            quotes.push(val);

          });

          $('title').text(`${version} Your Mood`);
          $('#logo-version').text(version.toLowerCase());
          $('#footer-version').text(version);

          appError = false;

          moodEngine.reload('Auto');
          moodEngine.rewind();

          pullTime['switch'] = Math.ceil(performance.now() - startTime);

          console.log(`Successfully switched version to ${version} in ${pullTime['switch']}ms.`);
          Materialize.toast(`Switched to ${version} Your Mood!`, fullSettings['toast_interval']);

        }).fail((data) => {

          moodEngine.error(`Failed to switch to ${version} Your Mood.`)

        });

      };

    }).fail((data) => {

      moodEngine.error('Failed to contact server. Try again later.', 'Failed to pull settings from backend.', '1c', 'backend');

    });

  }).fail((data) => {

    moodEngine.error('Failed to contact server. Try again later.', 'Failed to pull colours from backend.', '1b', 'backend');

  });

}).fail((data) => {

  moodEngine.error('Failed to contact server. Try again later.', 'Failed to pull quotes from backend.', '1a', 'backend');

});
