var appError, startTime, settingsOpen, lastNum, totalTime, disableSwitch;
var quotes = [];
var colours = [];
var usedQuotes = [];
var usedColours = [];
var quoteHistory = [];
var colourHistory = [];
var moodLog = [];
var cssColours = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];
var moodEngine = {};
var settings = {};
var fullSettings = {};
var pullTime = {};
var versionQuotes = {};
var platform = location.protocol === 'file:' ? 'app' : 'web';
var backendAddress = localStorage.getItem('backend_address') || 'improveyourmood.xyz';
var fullBackendAddress = `http://${backendAddress}/`;

if (platform === 'web') {

  var version = window.location.href.includes('decreaseyourmood') ? 'Decrease' : 'Improve';
  var otherVersion = window.location.href.includes('decreaseyourmood') ? 'Improve' : 'Decrease';

} else {

  var version = $('html').attr('data-version') === 'Decrease' ? 'Decrease' : 'Improve';
  var otherVersion = $('html').attr('data-version') === 'Decrease' ? 'Improve' : 'Decrease';
  var appVersion = JSON.parse($('html').attr('data-app-version').replace(/\./g, ''));

}

moodEngine.log = function(type, message) {

  moodLog.push({
    type: type,
    message: message
  });

  console[type](`\n${message}`);

};

moodEngine.sendLog = function() {

  console.log('\nSending log to backend...');

  $.ajax({
    type: 'POST',
    crossDomain: true,
    url: `${fullBackendAddress}api/create/log/index.php`,
    data: {
      version: version,
      platform: platform,
      userAgent: navigator.userAgent,
      log: JSON.stringify(moodLog)
    },
    success: function(response) {

      console.log('\nLog sent to backend successfully.');
      if (response) console.log(`Response: ${response}`);

    },
    error: function(response) {

      console.log('\nFailed to send log to backend.');
      if (response) console.log(`Response: ${response}`);

    }
  });

};

$(window).on('error', function(error) {

  moodEngine.error(null, `${error.originalEvent.message} (LINE NUMBER: ${error.originalEvent.lineno})`, '0');

  if (localStorage.length) {

    localStorage.clear();

    $('#error-message').text('Your settings have been cleared to try resolve the issue, reloading in 2 seconds...');

    setTimeout(function() {

      window.location.reload();

    }, 2000);

  }

});

$(document).ready(function() {

  // Put in correct text / favicon / year

  $('title').text(`${version} Your Mood`);
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  if (platform === 'web') $('link[rel="icon"], link[rel="shortcut icon"]').attr('href', `assets/${version.toLowerCase()}_favicon.ico`);

  $('#year').append(new Date().getFullYear());

  // Some buttons needs to work straight away

  // Retry loading

  $('#retry-button').click(function() {

    window.location.reload();

  });

  // Calculate proper top margin for certain elements

  $('.js-margin').css('margin-top', $(document).height() / 4.5);

  // Do it on resize too

  $(window).resize(function() {

    $('.js-margin').css('margin-top', $(document).height() / 4.5);

  });

  // Set vertical or horizontal menu

  if (JSON.parse(localStorage.getItem('vertical_menu'))) {

    $('.fixed-action-btn').removeClass('horizontal');
    $('#menu-button .alt-icon').toggleClass('inactive-icon');

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

  if (navigator.onLine || type !== 'backend') {

    if (!display) display = 'An error occured.';

    if (!log) log = 'An error occured.';

    if (code) $('#error-message').text(`${log} (${code})`);

    $('#quote').text(display);

    moodEngine.log('error', log);

    if (type === 'backend' && localStorage.getItem('backend_address')) {

      localStorage.removeItem('backend_address');
      $('#error-message').text('Back-end address reset, reloading in 2 seconds...');

      setTimeout(function() {

        window.location.reload();

      }, 2000);

    }

  } else {

    $('#quote').text('You are not connected to the internet.');
    $('#retry-button').removeClass('hide');
    moodEngine.log('log', 'No internet connection.');

  }

  appError = true;

  moodEngine.sendLog();

};

// Pull quotes from backend

startTime = performance.now();
totalTime = performance.now();

console.log(`%c${version.toLowerCase()} your mood 6`, 'font-family: "Oxygen"; font-size: 20px;');
console.log('――――――――――――――――――――――――――――――');
moodEngine.log('log', `Pulling from: ${fullBackendAddress}`);

moodEngine.log('log', 'Pulling quotes from backend...');

$.getJSON(`${fullBackendAddress + version.toLowerCase()}_quote_serializer.php`).done((data) => {

  pullTime.quotes = Math.ceil(performance.now() - startTime);

  versionQuotes[version] = quotes = [];

  $.each(data, function(key, val) {

    if ($.inArray(val, quotes) === -1) quotes.push(val);

  });

  $.getJSON(`${fullBackendAddress + otherVersion.toLowerCase()}_quote_serializer.php`).done((data) => {

    versionQuotes[otherVersion] = [];

    $.each(data, function(key, val) {

      if ($.inArray(val, versionQuotes[otherVersion]) === -1) versionQuotes[otherVersion].push(val);

    });

  }).fail((data) => {

    disableSwitch = true;
    moodEngine.log('warn', `Error fetching ${otherVersion} quotes, disabling switch feature.`)

  });

  moodEngine.log('log', `Successfully pulled ${quotes.length} quotes from backend in ${pullTime.quotes}ms.`);

  // Pull colours from backend

  startTime = performance.now();

  moodEngine.log('log', 'Pulling colours from backend...');

  $.getJSON(`${fullBackendAddress}colour_serializer.php`).done((data) => {

    pullTime.colours = Math.ceil(performance.now() - startTime);

    colours = [];

    $.each(data, function(key, val) {

      if ($.inArray(val, colours) === -1) colours.push(val);

    });

    moodEngine.log('log', `Successfully pulled ${colours.length} colours from backend in ${pullTime.colours}ms.`);

    var quoteNum;
    var colourNum;

    // Pull settings from backend

    startTime = performance.now();

    moodEngine.log('log', 'Pulling settings from backend...');

    $.getJSON(`${fullBackendAddress}settings_serializer.php`).done((data) => {

      pullTime.settings = Math.ceil(performance.now() - startTime);

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

      moodEngine.log('log', `Successfully pulled ${Object.keys(settings).length} settings from backend in ${pullTime.settings}ms.`);

    }).always((data) => {

      // Construct settings object from backend or local

      moodEngine.setSettings = function(method, toast) {

        let buttonOrder;

        if (method !== 'initial') buttonOrder = JSON.stringify(fullSettings.button_order);

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

            fullSettings[key] = settings[key].value;

          }

        });

        // Reload transitions

        if (fullSettings.colour_reload_transitions) {

          $('.coloured').css('transition', `${fullSettings.colour_reload_transition_time}ms ease-out`);

        } else {

          $('.coloured').css('transition', 'none');

        }

        // Build button menu

        if (method === 'initial' || JSON.stringify(fullSettings.button_order) !== buttonOrder && method !== 'buttonsSorted') {

          let fabOpen = $('.fixed-action-btn').hasClass('active');

          $('.fixed-action-btn').closeFAB();

          var menuHTML = '';

          if (!fullSettings.button_order || typeof(fullSettings.button_order) !== 'object' || !fullSettings.button_order.includes('settings')) {

            moodEngine.log('warn', 'Invalid button order provided, falling back to defaults...');
            fullSettings.button_order = ['autoreload', 'settings', 'rewind'];

          }

          var hasUserSettings = false;

          $.each(settings, function(key, val) {

            if (val.user) hasUserSettings = true;

          });

          $.each(fullSettings.button_order, function(key, val) {

            let html;
            let hidden;
            let mainIcon;

            switch (val) {

              case 'autoreload':
                mainIcon = disableSwitch ? '' : 'main-icon';
                html = `<li data-button="autoreload"><a class="btn-floating menu-button waves-effect transparent" id="toggle-auto-reload"><i class="material-icons ${mainIcon} theme-text" data-icon="autoreload" data-default="autorenew"></i><i class="material-icons alt-icon theme-text hide" data-icon="switchversion" data-default="swap_calls"></i></a></li>`;
                break;
              case 'settings':
                hidden = hasUserSettings ? '' : 'hide';
                html = `<li data-button="settings" class="${hidden}"><a class="btn-floating menu-button waves-effect transparent" id="settings-button"><i class="material-icons main-icon theme-text" data-icon="settings" data-default="settings"></i><i class="material-icons alt-icon theme-text hide" data-icon="setalldefault" data-default="clear_all"></i></a></li>`;
                break;
              case 'rewind':
                html = '<li data-button="rewind"><a class="btn-floating menu-button waves-effect transparent disabled" id="go-back-button"><i class="material-icons main-icon theme-text" data-icon="rewind" data-default="skip_previous"></i><i class="material-icons alt-icon theme-text hide" data-icon="fullrewind" data-default="first_page"></i></a></li>';
                break;
              default:
                html = '';
                moodEngine.log('warn', `Unknown value '${val}' in button order, skipping...`);

            }

            menuHTML += html;

          });

          $('#button-menu').html(menuHTML);

          // Set correct icons

          if (!fullSettings.button_icons) moodEngine.log('warn', 'Server has no icons, falling back to defaults...');

          $('.material-icons').each(function() {

            let icon;

            if (fullSettings.button_icons && fullSettings.button_icons[$(this).attr('data-icon')]) {

              icon = fullSettings.button_icons[$(this).attr('data-icon')]

            } else {

              if (fullSettings.button_icons && $(this).is('[data-icon]')) {

                moodEngine.log('warn', `No icon for ${$(this).attr('data-icon')}, using default...`);

              }

              icon = $(this).attr('data-default');

            }

            $(this).text(icon);

          });

          // Bind menu buttons

          $('#toggle-auto-reload').click(function(e) {

            e.shiftKey && platform === 'web' && !disableSwitch ? moodEngine.switchVersion() : moodEngine.toggleAutoReload();

          });

          $('#settings-button').click(function(e) {

            if (!appError) e.shiftKey && platform === 'web' ? moodEngine.setAllDefault() : moodEngine.toggleSettings();

          });

          $('#go-back-button').click(function(e) {

            e.shiftKey && platform === 'web' ? moodEngine.fullRewind() : moodEngine.rewind();

          });

          fabOpen ? $('.fixed-action-btn').openFAB() : $('.fixed-action-btn').closeFAB();

        }

        // Theme colour

        $('.theme-text').css('cssText', `color: ${fullSettings.theme_colour} !important`);

        // Touch / click gestures

        $('html').hammer().off();

        $('html').hammer().on(fullSettings.reverse_swipe_direction ? 'swiperight' : 'swipeleft', function(ev) {

          if (!appError & !settingsOpen) {

            let direction = fullSettings.reverse_swipe_direction ? 'right' : 'left';
            moodEngine.log('log', `Swiped ${direction} to reload.`);
            moodEngine.reload();

          }

        });

        $('html').hammer().on(fullSettings.reverse_swipe_direction ? 'swipeleft' : 'swiperight', function(ev) {

          if (!appError && !settingsOpen) {

            let direction = fullSettings.reverse_swipe_direction ? 'left' : 'right';
            moodEngine.log('log', `Swiped ${direction} to rewind.`);
            moodEngine.rewind();

          }

        });

        // Keyboard shortcuts

        if (platform === 'web') {

          Mousetrap.reset();

          // Shift click icons

          Mousetrap.bind(['shift'], function(e) {

            $('.menu-button').each(function() {

              $(this).find('.main-icon').addClass('hide');
              $(this).find('.alt-icon').removeClass('hide');

            });

          }, 'keydown');

          Mousetrap.bind(['shift'], function(e) {

            $('.menu-button').each(function() {

              $(this).find('.main-icon').removeClass('hide');
              $(this).find('.alt-icon').addClass('hide');

            });

          }, 'keyup');

          // Reload & Save Settings (because they share keys)

          if (typeof(fullSettings.reload_keys) === 'object') {

            Mousetrap.bindGlobal(fullSettings.reload_keys, function(e, combo) {

              if (!appError) {

                if (!settingsOpen) {

                  moodEngine.reload();

                } else if (fullSettings.save_settings_keys.includes(combo) && (!$('#settings-modal input:focus').parent().hasClass('chips') || !$('#settings-modal input:focus').val())) {

                  moodEngine.saveSettings();

                }

              }

            });

          }

          // Rewind

          if (typeof(fullSettings.back_keys) === 'object') {

            Mousetrap.bind(fullSettings.back_keys, function(e) {

              if (!appError && !settingsOpen) moodEngine.rewind();

            });

          }

          // Rewind

          if (typeof(fullSettings.full_rewind_keys) === 'object') {

            Mousetrap.bind(fullSettings.full_rewind_keys, function(e) {

              if (!appError && !settingsOpen) moodEngine.fullRewind();

            });

          }

          // Toggle Auto Reload

          if (typeof(fullSettings.auto_reload_keys) === 'object') {

            Mousetrap.bind(fullSettings.auto_reload_keys, function(e) {

              if (!appError && !settingsOpen) moodEngine.toggleAutoReload();

            });

          }

          // Toggle Button Menu

          if (typeof(fullSettings.menu_keys) === 'object') {

            Mousetrap.bind(fullSettings.menu_keys, function(e) {

              if (!appError && !settingsOpen) {

                let fabOpen = $('.fixed-action-btn').hasClass('active');

                fabOpen ? $('.fixed-action-btn').closeFAB() : $('.fixed-action-btn').openFAB();

              }

            });

          }

          // Toggle Settings Panel

          if (typeof(fullSettings.settings_keys) === 'object') {

            Mousetrap.bindGlobal(fullSettings.settings_keys, function(e) {

              if (!appError && !$('#settings-modal input:not([type="range"]):not([type="checkbox"]):focus').length) moodEngine.toggleSettings();

            });

          }

        }

        if (method !== 'initial') {

          moodEngine.toggleSettings('close');

          Materialize.toast(toast, fullSettings.toast_interval);

          if (fullSettings.backend_address !== backendAddress) {

            if (fullSettings.backend_address !== 'improveyourmood.xyz') {

              localStorage.setItem('keep_advanced_settings', true);

            } else {

              localStorage.removeItem('keep_advanced_settings');

            }

            window.location.reload();

          }

        }

      };

      moodEngine.setSettings('initial');

      // Check app version

      if (platform === 'app' && fullSettings.app_update_reminder && JSON.parse(fullSettings.app_version.replace(/\./g, '')) > appVersion) Materialize.toast(settings.app_update_reminder.description, fullSettings.toast_interval);

      // Set a default toast interval

      if (!fullSettings['toast_interval']) fullSettings['toast_interval'] = 2000;

      // Set inputs in modal

      moodEngine.setInputs = function(input) {

        let target = input ? `.settings-input[name="${input}"]` : '.settings-input:not(.select-wrapper)';

        $(target).each(function() {

          let setting = $(this).attr('name');
          let value = fullSettings[setting];

          if ($(this).is('select') || typeof(value) === 'object') {

            $(this).val(JSON.stringify(value));

          } else if ($(this).is('[type="checkbox"]')) {

            $(this).prop('checked', value);

          } else {

            $(this).val(value);

          }

          if ($(this).is('input') && !$(this).is('[type="checkbox"]')) $(this).parent().find('label').addClass('active');
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

            // Materialize Chips

            $(`div[name="${name}"]`).material_chip({
              data: values
            });

            // Clear chip input values when unfocused

            $('.chips input').focusout(function() {

              $(this).val('');

            });

            $('.chip').each(function() {

              if ($(this).contents().get(0).nodeValue === 'settings') $(this).find('i').remove();

            });

          }

        });

      }

      // Initialize modal plugin

      $('#settings-modal').modal({
        ready: function(modal, trigger) {

          // Scroll to the top of the modal

          if (fullSettings.scroll_settings && $('#settings-modal').scrollTop) {

            $('#settings-modal').animate({
              scrollTop: 0
            }, 200);

          }

          settingsOpen = true;

        },
        complete: function() {

          $('.thumb').remove();

          settingsOpen = false;

          $('#advanced-settings-button').removeClass('underline');
          $('#advanced-settings').hide();

        }
      });

      // Functions for closing and opening settings panel

      moodEngine.toggleSettings = function(action) {

        if (action) {

          if (action === 'open') moodEngine.setInputs();

          $('#settings-modal').modal(action);

        } else if (settingsOpen) {

          $('#settings-modal').modal('close');

        } else {

          moodEngine.setInputs();
          $('#settings-modal').modal('open');

        }

      }

      // Initialize sortable menu

      if (settings.button_order) {

        $('#button-menu').sortable({
          stop: function(event, ui) {

            var array = $('#button-menu').sortable('toArray', {
              attribute: 'data-button'
            });

            localStorage.setItem('button_order', JSON.stringify(array));
            moodEngine.setSettings('buttonsSorted');
            moodEngine.setInputs();

          }
        });

      }

      // Construct settings panel

      var fullHTML = '';
      var fullAdvancedHTML = '';

      $.each(settings, function(key, val) {

        if (val.user) {

          var optional = !!val.optional;
          let indicator = optional || !fullSettings.optional_indicators ? '' : ' <b>*</b>';
          let container = '';
          let containerClose = '';
          let input;
          let label;
          let inputField = 'input-field';
          let inputCol = 's12';
          let resetInput = '';

          if (fullSettings.reset_input_buttons) {

            inputCol = 's11'
            resetInput = `
                  <div class="col s1">
                    <a class="reset-input" data-setting="${key}">
                      <i class="material-icons prefix">refresh</i>
                    </a>
                  </div>`;

          }

          if (val.input === 'select') {

            input = `
                  <select class="settings-input" name="${key}">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  `;

            label = `
                  <label>${val.label}</label>
                  `;

          } else {

            if (val.input === 'chips') {

              input = `<div class="chips left-align settings-input" name="${key}" data-optional="${optional}"></div>`;

            } else if (val.input === 'range') {

              input = `<input type="range" name="${key}" class="settings-input" id="${key}" min="${val.min}" max="${val.max}">`;
              indicator = '';
              container = '<p class="range-field">';
              containerClose = '</p>';

            } else if (val.input === 'checkbox') {

              input = `<input type="checkbox" name="${key}" class="settings-input filled-in" id="${key}">`;
              indicator = '';
              container = '<p>';
              containerClose = '</p>';
              inputField = '';

            } else {

              input = `<input type="${val.input}" name="${key}" class="settings-input mousetrap" id="${key}" data-optional="${optional}">`;

            }

            label = `<label for="${key}">${val.label}${indicator}</label>`;

          }

          let mobile = val.mobile ? '' : 'hide-on-med-and-down';

          let html = `
                <div class="row ${mobile}">
                  <div class="${inputField} col ${inputCol}">
                    ${container}
                    ${input}
                    ${label}
                    ${containerClose}
                    <a class="black-text settings-link default-button" data-setting="${key}"><b>Set to Default</b></a>
                    <br>
                    <span class="tooltipped" data-setting="${key}" data-position="bottom" data-delay="50">What's this?</span>
                  </div>
                  ${resetInput}
                </div>
                `;

          val.advanced ? fullAdvancedHTML += html : fullHTML += html;

        }

      });

      $('#settings-form').prepend(fullHTML);

      if (fullAdvancedHTML) {

        $('#advanced-settings-wrapper').removeClass('hide');
        $('#advanced-settings').html(fullAdvancedHTML);

      }

      // Set desired settings to default using the attr on the default button

      $('.default-button').click(function() {

        let setting = $(this).attr('data-setting');
        localStorage.removeItem(setting);
        moodEngine.setSettings(null, `Set ${settings[setting].label} to Default!`);

      });

      // Reset inputs button

      $('.reset-input').click(function() {

        $('input').focusout();
        $('.thumb').remove();

        let setting = $(this).attr('data-setting');
        moodEngine.setInputs(setting);

      });

      // Set the correct values in the settings inputs on load

      moodEngine.setInputs();

      // Add defaults to tooltips

      $('.tooltipped').each(function() {

        let setting = $(this).attr('data-setting');
        let text;

        if (typeof(fullSettings[setting]) === 'object') {

          try {

            text = settings[setting].value.map((s) => {
              return ` ${s}`;
            });

          } catch (error) {

            text = settings[setting].value;

          }

        } else {

          text = settings[setting].value;

        }

        let value = `${settings[setting].description}.<br>The default is ${text}.`
        $(this).attr('data-tooltip', value);

        // Initialize the Materialize tooltip plugin

        $('.tooltipped').tooltip({
          html: true
        });

      });

      // Menu Button

      $('#menu-button').click(function(e) {

        if (e.shiftKey) {

          $(this).parent().toggleClass('horizontal');
          $(this).find('.alt-icon').toggleClass('inactive-icon');

          localStorage.setItem('vertical_menu', !$(this).parent().hasClass('horizontal'));

        }

      });

      // When chips are added, clean up values in array

      $('.chips').on('chip.add', function(e, chip) {

        let name = $(this).attr('name');

        $('.chip').each(function() {

          $(this).contents().get(0).nodeValue = $.trim($(this).contents().get(0).nodeValue);

          if (!$(this).contents().get(0).nodeValue) {

            $(this).remove();

          } else if ($(this).contents().get(0).nodeValue === 'settings') {

            $(this).find('i').remove();

          }

        });

        $.each($(`.chips[name="${name}"]`).material_chip('data'), function(key, val) {

          let newVal = $.trim(val.tag);

          $(`.chips[name="${name}"]`).material_chip('data')[key].tag = newVal;

          if (!newVal) $(`.chips[name="${name}"]`).material_chip('data').splice(key, 1);

        });

      });

      // Don't allow deleting the settings chip

      $('.chips').on('chip.delete', function(e, chip) {

        if (chip.tag === 'settings') {

          $('.chips[name="button_order"]').material_chip('data').push({
            tag: 'settings'
          });

          if ($('.chips[name="button_order"] .chip').length) {

            $('<div class="chip">settings</div>').insertAfter($('.chips[name="button_order"] .chip').last());

          } else {

            $('.chips[name="button_order"]').prepend('<div class="chip">settings</div>');

          }

        }

      });

      // Auto reload

      (function autoReload() {

        if (!fullSettings.reload_interval && fullSettings.reload_interval !== 0) fullSettings.reload_interval = 3000;

        setTimeout(function() {

          if (!moodEngine.notAutoReloading() && !appError) {

            moodEngine.reload('Auto');
            moodEngine.log('log', `Auto reloaded after ${fullSettings.reload_interval}ms.`);

          }

          autoReload();

        }, fullSettings.reload_interval);

      })();

      // Allows other functions to check if currently auto reloading

      moodEngine.notAutoReloading = function() {

        return $('main').hasClass('manual-reload');

      };

      // Toggle auto reload when the button is clicked

      moodEngine.toggleAutoReload = function() {

        if (!appError) {

          let toggle = moodEngine.notAutoReloading() ? 'Enabled' : 'Disabled';
          let icon_text = moodEngine.notAutoReloading() ? 'close' : 'autorenew';
          let icon = $('#toggle-auto-reload i.main-icon');

          if (moodEngine.notAutoReloading()) {

            $('#go-back-button').addClass('disabled');

          } else if (quoteHistory.length > 1) {

            $('#go-back-button').removeClass('disabled');

          }

          icon.text(icon_text);
          $('main').toggleClass('manual-reload');
          Materialize.toast(`Auto Reload ${toggle}!`, fullSettings.toast_interval);

        }

      };

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

          if (fullSettings.text_reload_transitions) {

            $('#quote').fadeOut(fullSettings.text_reload_transition_time / 2, function() {

              $(this).text(quote).fadeIn(fullSettings.text_reload_transition_time / 2);

            });

          } else {

            $('#quote').text(quote);

          }

          $('.coloured').css('background-color', `#${colour}`);
          $('meta[name="theme-color"]').attr('content', `#${colour}`);

        }

        if (quoteHistory.length === 1 || !moodEngine.notAutoReloading()) $('#go-back-button').addClass('disabled');

      };

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

          if (fullSettings.text_reload_transitions) {

            $('#quote').fadeOut(fullSettings.text_reload_transition_time / 2, function() {

              $(this).text(quotes[quote]).fadeIn(fullSettings.text_reload_transition_time / 2);

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

          if (quotes.length < 2) throw new Error('There are no quotes.');

          // Clear error message in case there is one

          $('#error-message').empty();

          lastNum = JSON.parse(localStorage.getItem('lastQuote'));
          quoteNum = Math.floor(quotes.length * Math.random());

          // If all quotes are used and no repeats is enabled, start again

          if (usedQuotes.length === quotes.length && fullSettings.no_repeats) usedQuotes = [];

          // If MoodEngine trys to use the same quote twice, or one that has already been used, generate a new one

          while (lastNum === quoteNum || fullSettings.no_repeats && usedQuotes.includes(quoteNum)) {

            quoteNum = Math.floor(quotes.length * Math.random());

          }

          // Add quote to used quotes, quote history and localStorage

          usedQuotes.push(quoteNum);
          quoteHistory.push(quoteNum);
          localStorage.setItem('lastQuote', quoteNum);

          let quote = quotes[quoteNum];

          // Display quote on the text element

          if (fullSettings.text_reload_transitions) {

            $('#quote').fadeOut(fullSettings.text_reload_transition_time / 2, function() {

              $(this).text(quote).fadeIn(fullSettings.text_reload_transition_time / 2);

            });

          } else {

            $('#quote').text(quote);

          }

          // Reload the colour

          // If backend has no colours, throw an error

          if (colours.length < 2) throw new Error('There are no colours.');

          lastNum = JSON.parse(localStorage.getItem('lastColour'));
          colourNum = Math.floor(colours.length * Math.random());

          // If MoodEngine trys to use the same colour twice, generate a new one

          while (lastNum === colourNum) {

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

          if (method !== 'Auto') $('#go-back-button').removeClass('disabled');

          // Log quote/colour in console (for fun)

          if (typeof(fullSettings.extra_logging) === 'object' && fullSettings.extra_logging.includes('reload') && platform === 'web') {

            console.log(`\n%c${quotes[quoteNum]}`, `padding: 2px 5px; font-size: 20px; font-family: 'Oxygen'; color: white; background-color: #${colours[colourNum]}`);

          }

        }

      };

      // Try to initialize the MoodEngine if there are no errors

      if (!appError) {

        moodEngine.log('log', 'Initializing MoodEngine...');

        try {

          moodEngine.reload('Auto');
          $('#quote').addClass('scale-in');
          $('.preloader-wrapper').addClass('hide');
          $('#retry-button').hide();
          $('.fixed-action-btn').removeClass('hide');
          moodEngine.log('log', 'MoodEngine initialized.');
          let totalLoadTime = Math.ceil(performance.now() - totalTime);
          moodEngine.log('log', `Total load time: ${totalLoadTime}ms.`);

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

        if (fullSettings.text_reload_transitions) {

          $('#quote').fadeOut(fullSettings.text_reload_transition_time / 2, function() {

            $(this).text(text).fadeIn(fullSettings.text_reload_transition_time / 2);

          });

        } else {

          $('#quote').text(text);

        }

        $('.coloured').css('background-color', `#${colour}`);
        $('meta[name="theme-color"]').attr('content', `#${colour}`);

      };

      // Set all settings to default

      moodEngine.setAllDefault = function() {

        let restoreSettings = {};
        let advancedClosed = !$('#advanced-settings-button').hasClass('underline');
        let lastQuote = localStorage.getItem('lastQuote');
        let lastColour = localStorage.getItem('lastColour');

        $.each(settings, function(key, val) {

          if (val.advanced) restoreSettings[key] = localStorage.getItem(key);

        });

        localStorage.clear();
        localStorage.setItem('lastQuote', lastQuote);
        localStorage.setItem('lastColour', lastColour);

        $.each(restoreSettings, function(key, val) {

          if (advancedClosed && fullSettings.keep_advanced_settings) {

            if (val) localStorage.setItem(key, restoreSettings[key]);

          }

        });

        moodEngine.setSettings(null, 'Set All Settings to Default!');

      };

      $('.set-all-default').click(function() {

        moodEngine.setAllDefault();

      });

      // When user trys to save settings

      moodEngine.saveSettings = function() {

        let localSettings = {};
        let spaceInputs = [];
        let emptyInputs = [];
        let invalidInputs = [];

        $('.settings-input:not(.select-wrapper)').each(function() {

          // Construct the object using values

          if ($(this).hasClass('chips')) {

            let array = [];

            $.each($(this).material_chip('data'), function(key, val) {

              array.push(val.tag);

            });

            localSettings[$(this).attr('name')] = JSON.stringify(array);

          } else if ($(this).is('[type="checkbox"]')) {

            localSettings[$(this).attr('name')] = $(this).is(':checked');

          } else {

            localSettings[$(this).attr('name')] = $(this).val();

          }

          // Detect if input is blank

          $(this).addClass('invalid');

          if ($(this).attr('data-optional') !== 'true' && ((!$(this).hasClass('chips') && !$(this).val() || $(this).val() === 'null') || $(this).hasClass('chips') && !$(this).material_chip('data').length)) {

            emptyInputs.push(` ${settings[$(this).attr('name')].label}`);

          } else if ($(this).val().indexOf(' ') >= 0) {

            spaceInputs.push(` ${settings[$(this).attr('name')].label}`);

          } else {

            $(this).removeClass('invalid');

          }

          // Custom Validations

          if ($(this).val() && $(this).val().indexOf(' ') < 0) {

            // Theme Colour

            if ($(this).attr('name') === 'theme_colour' && !cssColours.includes($(this).val().toLowerCase())) {

              $(this).addClass('invalid');
              invalidInputs.push(`'${$(this).val()}' is not a valid CSS colour.`);

            }

            // Backend Address

            if ($(this).attr('name') === 'backend_address' && $(this).val() !== backendAddress) {

              $.ajaxSetup({
                async: false
              });

              $.getJSON(`http://${$(this).val()}/colour_serializer.php`).fail((data) => {

                $(this).addClass('invalid');
                invalidInputs.push(`${settings[$(this).attr('name')].label} '${$(this).val()}' is Invalid.`);

              });

              $.ajaxSetup({
                async: true
              });

            }

            // Button Order

            if ($(this).attr('name') === 'button_order' && settings.button_order.value.includes('settings') && !localSettings.button_order.includes('settings')) {

              $(this).addClass('invalid');
              invalidInputs.push(`${settings[$(this).attr('name')].label} Needs to Include Settings`);

            }

          }

          // Chips

          if ($(this).hasClass('chips')) {

            let input = $(this);
            let name = settings[input.attr('name')].label;

            $(this).find('.chip').each(function() {

              if ($(this).contents().get(0).nodeValue.indexOf(' ') >= 0) {

                input.addClass('invalid');
                invalidInputs.push(`Keyboard Shortcuts in ${name} Cannot Contain Spaces`);

              }

            });

          }

        });

        // If all inputs are not blank nor invalid

        if (!spaceInputs.length && !emptyInputs.length && !invalidInputs.length) {

          try {

            $.each(localSettings, function(key, val) {

              // If the set value is the same as the default, just remove it from localStorage and use backend value

              if (val === settings[key].value || val === JSON.stringify(settings[key].value) || `[${val}]` === JSON.stringify(settings[key].value)) {

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

            Materialize.toast('Unable to Save Settings. An Error Occurred.', fullSettings.toast_interval);
            moodEngine.log('error', `Couldn't save settings. Error: ${error}.`);

          }

          // Close the modal no matter what

          moodEngine.toggleSettings('close');

        } else {

          if (spaceInputs.length) {

            if (spaceInputs.length === 1) {

              Materialize.toast(`${spaceInputs} Contains Spaces.`, fullSettings.toast_interval);

            } else {

              Materialize.toast(`${spaceInputs.length} Fields Contain Spaces.`, fullSettings.toast_interval);

            }

          }

          if (emptyInputs.length) {

            if (emptyInputs.length === 1) {

              Materialize.toast(`${emptyInputs} Is Empty.`, fullSettings.toast_interval);

            } else {

              Materialize.toast(`${emptyInputs.length} Fields Are Empty.`, fullSettings.toast_interval);

            }

          }

          if (invalidInputs.length) {

            $.each(invalidInputs, function(key, val) {

              Materialize.toast(val, fullSettings.toast_interval);

            });

          }

        }

      };

      $('#save-settings-button').click(function(e) {

        moodEngine.saveSettings();

        if (e.shiftKey && platform === 'web') window.location.reload();

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

        if (!appError && !disableSwitch) {

          version = version === 'Improve' ? 'Decrease' : 'Improve';
          otherVersion = version === 'Improve' ? 'Improve' : 'Decrease';
          quotes = versionQuotes[otherVersion];
          quoteHistory = [];
          colourHistory = [];
          usedQuotes = [];

          $('title').text(`${version} Your Mood`);
          $('#logo-version').text(version.toLowerCase());
          $('#footer-version').text(version);

          moodEngine.reload('Auto');
          moodEngine.rewind();

          moodEngine.log('log', `Switched version to ${version}.`);
          Materialize.toast(`Switched to ${version} Your Mood!`, fullSettings.toast_interval);

        }

      };

    }).fail((data) => {

      moodEngine.log('error', 'Failed to pull settings from backend, running in defaults mode...');

    });

  }).fail((data) => {

    moodEngine.error('Failed to contact server. Try again later.', 'Failed to pull colours from backend.', '1b', 'backend');

  });

}).fail((data) => {

  moodEngine.error('Failed to contact server. Try again later.', 'Failed to pull quotes from backend.', '1a', 'backend');

});
