let appError, defaultMode, startTime, modalOpen, lastNum, disableSwitch, quoteNum, colourNum, isProd;
let quotes = [];
let colours = [];
let usedQuotes = [];
let usedColours = [];
let quoteHistory = [];
let colourHistory = [];
let moodLog = [];
let moodEngine = {};
let settings = {};
let fullSettings = {};
let pullTime = {};
let versionQuotes = {};
let backendAddress = localStorage.getItem('backend_address') || 'https://improveyourmood.xyz';
let pageSSL = window.location.protocol === 'https:';
let totalTime = performance.now();
let version = window.location.href.includes('decreaseyourmood') ? 'Decrease' : 'Improve';
let otherVersion = window.location.href.includes('decreaseyourmood') ? 'Improve' : 'Decrease';

// Disable JSON caching

$.ajaxSetup({
  cache: false
});

moodEngine.log = function(type, message, display) {

  if (['log', 'warn', 'error'].includes(type) && message) {

    moodLog.push({
      type: type,
      message: message
    });

    if (display !== false) {

      console[type](`\n${message}`);

    }

    $('#visible-logs').empty();

    $.each(moodLog, function(key, val) {

      $('#visible-logs').append(`<div class="log"><b><span class="log-${val.type}">${val.type}:</span></b> <div class="content">${val.message}</div></div><br>`);

    });

  } else {

    console.error('INCORRECT USE OF MOODENGINE LOG');

  }

};

moodEngine.sendLogs = function(method) {

  //if (localStorage.length) moodEngine.log('log', `localStorage: ${JSON.stringify(localStorage)}`, false);

  console.log('\nSending logs to backend...');

  if (method === 'button') Materialize.toast('Sending Logs To Back-End...', fullSettings.toast_interval);

  $.ajax({
    type: 'POST',
    crossDomain: true,
    url: `${backendAddress}/api/create/log/index.php`,
    data: {
      version: version,
      userAgent: navigator.userAgent,
      log: JSON.stringify(moodLog)
    },
    success: function(response) {

      console.log('\nLogs sent to backend successfully.');
      if (method === 'button') Materialize.toast('Logs Sent To Back-End Successfully.', fullSettings.toast_interval);
      if (response) console.log(`Response: ${response}`);

    },
    error: function(response) {

      console.log('\nFailed to send logs to backend.');
      if (method === 'button') Materialize.toast('Failed To Send Logs to Back-End.', fullSettings.toast_interval);
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

  // Remove hash from URL

  history.pushState('', document.title, window.location.pathname);

  // Put in correct text / favicon / year

  $('title').text(`${version} Your Mood`);
  $('#logo-version').text(version.toLowerCase());
  $('#footer-version').text(version);

  // Fade in elements

  $('.fade-in-on-ready').fadeIn();

  $('link[rel="icon"], link[rel="shortcut icon"]').attr('href', `assets/${version.toLowerCase()}_favicon.ico`);

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

  // Send Logs

  $('#send-logs-button').click(function() {

    moodEngine.sendLogs('button');

  });

});

// Function for modifiying hex

function modifyColour(hex, lum) {

  hex = hex.replace(/[^0-9a-f]/gi, '');

  if (hex.length === 3) {

    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

  }

  lum = lum || 0;

  let c, i;
  let rgb = '#';

  for (i = 0; i < 3; i++) {

    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += (`00${c}`).substr(c.length);

  }

  return rgb;

}

// Function for converting hex to rgba

function hexToRgbA(hex, opacity) {

  let c;

  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {

    c = hex.substring(1).split('');

    if (c.length === 3) {

      c = [c[0], c[0], c[1], c[1], c[2], c[2]];

    }

    c = '0x' + c.join('');

    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';

  }

}

// Function for changing colour

moodEngine.setColour = function(colour) {

  $('.coloured.coloured-background').css('background-color', colour);
  $('.coloured.coloured-text').css('color', colour);
  $('meta[name="theme-color"]').attr('content', colour);
  $('#colour-style').text(`

    input[type="range"]::-webkit-slider-thumb, input[type="range"] + .thumb, .chip.selected, input[type="checkbox"]:checked + label::after, .dropdown-content.select-dropdown, input[type="radio"]:checked+label:after, .switch label input[type=checkbox]:checked+.lever {
      background-color: ${colour} !important;
    }

    .switch label input[type=checkbox]:checked+.lever:after {
      background-color: ${modifyColour(colour, -0.15)} !important;
    }

    .switch label .lever:before {
      background-color: ${hexToRgbA(colour, 0.15)} !important;
    }

    input[type="checkbox"] + label::after, .input-field input:not([type="range"]):not(.input):focus, .chips.focus, input[type="radio"]:checked+label:after {
      border-color: ${colour} !important;
    }

    .input-field input:not([type="range"]):not(.input):focus, .chips.focus {
      box-shadow: 0 1px 0 0 ${colour} !important;
    }

    `);

};

// Function for setting text

moodEngine.setText = function(text) {

  if (fullSettings.text_reload_transition_time) {

    $('#quote').fadeOut(fullSettings.text_reload_transition_time / 2, function() {

      $(this).text(text).fadeIn(fullSettings.text_reload_transition_time / 2);

    });

  } else {

    $('#quote').text(text);

  }

};

// Function for displaying and logging errors

moodEngine.error = function(display, log, code, type) {

  moodEngine.setColour('black');
  $('.theme-text').css('color', 'white');
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

  moodEngine.sendLogs();

};

console.log(`%c${version.toLowerCase()} your mood 6`, 'font-family: "Oxygen"; font-size: 20px;');
console.log('――――――――――――――――――――――――――――――');
moodEngine.log('log', `Pulling from: ${backendAddress}`);

$.get(`${backendAddress}/api/verify/index.php`, function(data) {

  isProd = data === 'improveyourmood.xyz';

});

// Decide whether to use cache or pull new quotes

if (localStorage.getItem('cachedQuotes') && localStorage.getItem('cachedVersionQuotes') && localStorage.getItem('disable_caching') !== 'true') {

  quotes = JSON.parse(localStorage.getItem('cachedQuotes'));
  versionQuotes = JSON.parse(localStorage.getItem('cachedVersionQuotes'));

  moodEngine.log('log', `Using ${quotes.length} cached quotes...`);

} else {

  // Pull quotes from backend

  startTime = performance.now();

  moodEngine.log('log', 'Pulling quotes from backend...');

  $.ajaxSetup({
    async: false
  });

  $.getJSON(`${backendAddress}/api/get/quotes/index.php?version=${version.toLowerCase()}`).done((data) => {

    pullTime.quotes = Math.ceil(performance.now() - startTime);

    versionQuotes[version] = quotes = [];

    $.each(data, function(key, val) {

      if ($.inArray(val, quotes) === -1) quotes.push(val);

    });

    $.getJSON(`${backendAddress}/api/get/quotes/index.php?version=${otherVersion.toLowerCase()}`).done((data) => {

      versionQuotes[otherVersion] = [];

      $.each(data, function(key, val) {

        if ($.inArray(val, versionQuotes[otherVersion]) === -1) versionQuotes[otherVersion].push(val);

      });

      localStorage.setItem('cachedVersionQuotes', JSON.stringify(versionQuotes));

    }).fail((data) => {

      disableSwitch = true;
      moodEngine.log('warn', `Error fetching ${otherVersion} quotes, disabling switch feature.`);

    });

    moodEngine.log('log', `Successfully pulled ${quotes.length} quotes from backend in ${pullTime.quotes}ms.`);

    if (localStorage.getItem('disable_caching') !== 'true') {

      localStorage.setItem('cachedQuotes', JSON.stringify(quotes));

      moodEngine.log('log', 'Cached quotes for next load.');

    } else {

      localStorage.removeItem('cachedQuotes');

    }

  }).fail((data) => {

    moodEngine.error('Failed to contact server. Try again later.', 'Failed to pull quotes from backend.', '1a', 'backend');

  });

  $.ajaxSetup({
    async: true
  });

}

// Decide whether to use cache or pull new colours

if (localStorage.getItem('cachedColours') && localStorage.getItem('disable_caching') !== 'true') {

  colours = JSON.parse(localStorage.getItem('cachedColours'));

  moodEngine.log('log', `Using ${colours.length} cached colours...`);

} else {

  // Pull colours from backend

  startTime = performance.now();

  moodEngine.log('log', 'Pulling colours from backend...');

  $.ajaxSetup({
    async: false
  });

  $.getJSON(`${backendAddress}/api/get/colours/index.php`).done((data) => {

    pullTime.colours = Math.ceil(performance.now() - startTime);

    colours = [];

    $.each(data, function(key, val) {

      if ($.inArray(val, colours) === -1) colours.push(val);

    });

    moodEngine.log('log', `Successfully pulled ${colours.length} colours from backend in ${pullTime.colours}ms.`);

    if (localStorage.getItem('disable_caching') !== 'true') {

      localStorage.setItem('cachedColours', JSON.stringify(colours));

      moodEngine.log('log', 'Cached colours for next load.');

    } else {

      localStorage.removeItem('cachedColours');

    }

  }).fail((data) => {

    moodEngine.error('Failed to contact server. Try again later.', 'Failed to pull colours from backend.', '1b', 'backend');

  });

  $.ajaxSetup({
    async: true
  });

}

// Pull settings from backend

startTime = performance.now();

moodEngine.log('log', 'Pulling settings from backend...');

$.getJSON(`${backendAddress}/api/get/settings/index.php`).fail((data) => {

  moodEngine.log('warn', 'Failed to pull settings from backend, running in default settings mode...');

  $.ajaxSetup({
    async: false
  });

  $.getJSON('assets/json/default_settings.json').done((data) => {

    defaultMode = true;
    fullSettings = data;

  }).fail((data) => {

    let reason = data.status === 404 ? 'missing' : 'damaged';

    moodEngine.log('warn', `Failed to pull default settings, local JSON file is ${reason}.`);

  });

  $.ajaxSetup({
    async: true
  });

}).done((data) => {

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

    let userSettings = 0;
    let backendSettings = 0;

    let currentSettings = {};
    let logs = [];

    if (method !== 'initial') {

      $.each(fullSettings, function(key, val) {

        currentSettings[key] = val;

      });

    }

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

        userSettings++;

      } else {

        fullSettings[key] = settings[key].value;

        backendSettings++;

      }

      if (method !== 'initial' && JSON.stringify(fullSettings[key]) !== JSON.stringify(currentSettings[key])) {

        $(`.settings-input[name="${key}"]`).addClass('dirty');

        let currentValue;
        let newValue;

        switch (typeof(fullSettings[key])) {

          case 'boolean':
          case 'number':
            currentValue = currentSettings[key];
            newValue = fullSettings[key];
            break;
          case 'object':
          case 'string':
            currentValue = JSON.stringify(currentSettings[key]);
            newValue = JSON.stringify(fullSettings[key]);
            break;

        }

        logs.push(`${key}: ${currentValue} => ${newValue}`);

      }

    });

    // Colour transitions

    if (fullSettings.colour_reload_transition_time) $('.coloured').css('transition', `${fullSettings.colour_reload_transition_time}ms ease-out`);

    // Build button menu

    if (method === 'initial' || JSON.stringify(fullSettings.button_order) !== buttonOrder && method !== 'buttonsSorted') {

      let fabOpen = $('.fixed-action-btn').hasClass('active');

      $('.fixed-action-btn').closeFAB();

      let hasUserSettings = false;

      $.each(settings, function(key, val) {

        if (val.user) hasUserSettings = true;

      });

      let menuHTML = '';

      if (!defaultMode && (!fullSettings.button_order || typeof(fullSettings.button_order) !== 'object' || !fullSettings.button_order.includes('settings'))) {

        moodEngine.log('warn', 'Invalid button order provided, falling back to defaults...');
        fullSettings.button_order = ['autoreload', 'settings', 'rewind'];

      }

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
          case 'speak':
            hidden = fullSettings.speak_voice_accent ? '' : 'hide';
            html = `<li data-button="speak" class="${hidden}"><a class="btn-floating menu-button waves-effect transparent" id="speak-quote-button"><i class="material-icons theme-text" data-icon="speak" data-default="volume_up"></i></a></li>`;
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

      if (!defaultMode && !fullSettings.button_icons) moodEngine.log('warn', 'Server has no icons, falling back to defaults...');

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

        e.shiftKey && !disableSwitch ? moodEngine.switchVersion() : moodEngine.toggleAutoReload();

      });

      $('#settings-button').click(function(e) {

        if (!appError) e.shiftKey ? moodEngine.setAllDefault() : moodEngine.toggleSettings();

      });

      $('#speak-quote-button').click(function() {

        if (!appError) {

          try {

            responsiveVoice.speak($('#quote').text(), fullSettings.speak_voice_accent);

          } catch (error) {

            moodEngine.log('error', `Cannot speak quote, invalid voice accent provided ('${fullSettings.speak_voice_accent}').`);
            Materialize.toast('Invalid Voice Accent Provided.', fullSettings.toast_interval)

          }

        }

      });

      $('#go-back-button').click(function(e) {

        e.shiftKey ? moodEngine.fullRewind() : moodEngine.rewind();

      });

      fabOpen ? $('.fixed-action-btn').openFAB() : $('.fixed-action-btn').closeFAB();

    }

    // Theme colour

    $('.theme-text').css('cssText', `color: ${fullSettings.theme_colour} !important`);
    $('.fade-in-on-ready').css('display', 'block');

    // Touch / click gestures

    $('html').hammer().off();

    $('html').hammer().on(fullSettings.reverse_swipe_direction ? 'swiperight' : 'swipeleft', function(ev) {

      if (!appError & !modalOpen) {

        let direction = fullSettings.reverse_swipe_direction ? 'right' : 'left';
        moodEngine.log('log', `Swiped ${direction} to reload.`);
        moodEngine.reload();

      }

    });

    $('html').hammer().on(fullSettings.reverse_swipe_direction ? 'swipeleft' : 'swiperight', function(ev) {

      if (!appError && !modalOpen) {

        let direction = fullSettings.reverse_swipe_direction ? 'left' : 'right';
        moodEngine.log('log', `Swiped ${direction} to rewind.`);
        moodEngine.rewind();

      }

    });

    // Keyboard shortcuts

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

      if (fullSettings.reload_keys.includes('enter')) {

        Mousetrap.bindGlobal(fullSettings.reload_keys, function(e, combo) {

          if (!appError) {

            if (!modalOpen) {

              moodEngine.reload();

            } else if ($('#settings-modal').hasClass('open') && fullSettings.save_settings_keys.includes(combo) && (!$('#settings-modal input:focus').parent().hasClass('chips') || !$('#settings-modal input:focus').val())) {

              moodEngine.saveSettings();

            }

          }

        });

      } else {

        Mousetrap.bindGlobal(fullSettings.reload_keys, function(e, combo) {

          if (!appError && !modalOpen) {

            moodEngine.reload();

          }

        });

        if (typeof(fullSettings.save_settings_keys) === 'object') {

          Mousetrap.bindGlobal(fullSettings.save_settings_keys, function(e, combo) {

            if (modalOpen && (!$('#settings-modal input:focus').parent().hasClass('chips') || !$('#settings-modal input:focus').val())) {

              moodEngine.saveSettings();

            }

          });

        }

      }

    }

    // Rewind

    if (typeof(fullSettings.back_keys) === 'object') {

      Mousetrap.bind(fullSettings.back_keys, function(e) {

        if (!appError && !modalOpen) moodEngine.rewind();

      });

    }

    // Rewind

    if (typeof(fullSettings.full_rewind_keys) === 'object') {

      Mousetrap.bind(fullSettings.full_rewind_keys, function(e) {

        if (!appError && !modalOpen) moodEngine.fullRewind();

      });

    }

    // Toggle Auto Reload

    if (typeof(fullSettings.auto_reload_keys) === 'object') {

      Mousetrap.bind(fullSettings.auto_reload_keys, function(e) {

        if (!appError && !modalOpen) moodEngine.toggleAutoReload();

      });

    }

    // Toggle Button Menu

    if (typeof(fullSettings.menu_keys) === 'object') {

      Mousetrap.bind(fullSettings.menu_keys, function(e) {

        if (!appError && !modalOpen) {

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

    // View Logs

    if (typeof(fullSettings.view_logs_keys) === 'object') {

      Mousetrap.bindGlobal(fullSettings.view_logs_keys, function(e) {

        if (!appError && !modalOpen) $('#logs-modal').modal('open');

      });

    }

    if (method !== 'initial') {

      moodEngine.toggleSettings('close');

      Materialize.toast(toast, fullSettings.toast_interval);

      if (fullSettings.backend_address !== backendAddress) {

        localStorage.clear();
        localStorage.setItem('backend_address', fullSettings.backend_address);
        if (fullSettings.backend_address !== 'https://improveyourmood.xyz') localStorage.setItem('keep_advanced_settings', true);
        window.location.reload();

      }

    }

    if (method!== 'initial' && !moodEngine.notAutoReloading()) moodEngine.toggleAutoReload();

    if (userSettings || backendSettings) moodEngine.log('log', `Settings set successfully. ${userSettings} user defined, ${backendSettings} backend defined.`);

    if (method !== 'initial' && logs.length) {

      moodEngine.log('log', 'Changed Settings:');

      $.each(logs, function(key, val) {

        moodEngine.log('log', val);

      });

    }

  };

  // Construct tabs in settings panel

  let tabHTML = {};
  let fullHTML = '';

  if (settings.tabs) {

    $.each(settings.tabs.value, function(key, val) {

      let name = val;
      let mobile = 'hide-on-med-and-down';
      tabHTML[name] = '';

      $.each(settings, function(key, val) {

        if (val.user && val.tab === name && val.mobile) {

          mobile = '';

        }

      });

      let html = `<li class="tab ${mobile} coloured coloured-background"><a href="#tab-${name}">${name}</a></li>`;

      $('.tabs').append(html);

      $('#settings-form').append(`<div id="tab-${name}" class="col s12"></div>`);

    });

  } else {

    $('ul.tabs').remove();

  }

  $('.tab a').click(function() {

    localStorage.setItem('lastTab', $(this).attr('href'));

  });

  // Set settings

  moodEngine.setSettings('initial');

  // Set inputs in modal

  moodEngine.setInputs = function(input, method) {

    let target;
    let success = true;

    if (input) {

      target = `.settings-input[name="${input}"]`;

    } else if (method === 'initial') {

      target = '.settings-input:not(.select-wrapper)';

    } else if ($('.dirty').length) {

      target = '.settings-input.dirty:not(.select-wrapper)';

    } else {

      success = false;

    }

    let log = success ? `Inputs set successfully, target was '${target}'` : 'No inputs to set.';
    moodEngine.log('log', log);

    $(target).each(function() {

      $(this).removeClass('dirty');

      let setting = $(this).attr('name');
      let value = fullSettings[setting];

      if (($(this).is('select') && typeof(value) === 'boolean') || typeof(value) === 'object') {

        $(this).val(JSON.stringify(value));

      } else if ($(this).is('[type="checkbox"]')) {

        $(this).prop('checked', value);

      } else if ($(this).is('[type="radio"]')) {

        let index;

        if (settings[setting].options) {

          $.each(settings[setting].options, function(key, val) {

            if (val === value) index = key;

          });

          $(`#${setting}_${index}`).prop('checked', true);

        } else {

          value = JSON.stringify(value);

          $(`#${setting}_${value}`).prop('checked', true);

        }

      } else if ($(this).is('[type="range"]') && method !== 'initial' && modalOpen) {

        let input = $(this);
        let max = parseInt(input.attr('max'));
        let amount = max % 250 === 0 ? max / 250 : 10;
        let currentValue = Math.ceil((parseInt(input.val()) + 1) / amount) * amount;

        let interval = setInterval(function() {

          currentValue > value ? currentValue -= amount : currentValue += amount;

          input.val(currentValue);

          if (currentValue === value) clearInterval(interval);

        }, 1);

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

        // Remove delete button from settings chip

        $('.chip').each(function() {

          if ($(this).contents().get(0).nodeValue === 'settings') $(this).find('i').remove();

        });

      }

    });

  }

  // Initialize modal plugin

  $('#settings-modal').modal({
    ready: function(modal, trigger) {

      if (settings.tabs) $('ul.tabs').tabs();

      // Scroll to the top of the modal

      if (fullSettings.scroll_settings && $('#settings-modal').scrollTop) {

        $('#settings-modal').animate({
          scrollTop: 0
        }, 200);

      }

      modalOpen = true;

    },
    complete: function() {

      $('.thumb').remove();

      modalOpen = false;

    }
  });

  $('#logs-modal').modal({
    ready: function(modal, trigger) {

      modalOpen = true;

    },
    complete: function() {

      modalOpen = false;

    }
  });

  // Functions for closing and opening settings panel

  moodEngine.toggleSettings = function(action) {

    if (action) {

      if (action === 'open') moodEngine.setInputs();

      $('#settings-modal').modal(action);

    } else if (modalOpen) {

      $('#settings-modal').modal('close');

    } else {

      moodEngine.setInputs();
      $('#settings-modal').modal('open');

    }

  };

  // Initialize sortable menu

  if (settings.button_order) {

    $('#button-menu').sortable({
      stop: function(event, ui) {

        let array = $('#button-menu').sortable('toArray', {
          attribute: 'data-button'
        });

        if (JSON.stringify(array) !== JSON.stringify(fullSettings.button_order)) {

          localStorage.setItem('button_order', JSON.stringify(array));
          moodEngine.setSettings('buttonsSorted');

        }

      }
    });

  }

  // Build settings panel

  $.each(settings, function(key, val) {

    if (val.user) {

      let indicator = val.optional || !fullSettings.optional_indicators ? '' : ' <b>*</b>';
      let container = '';
      let containerClose = '';
      let input;
      let label;
      let inputField = 'input-field';
      let inputCol = 's12';
      let resetInput = '';

      if (fullSettings.reset_input_buttons) {

        inputCol = 'm11 s10'
        resetInput = `
                  <div class="col m1 s2">
                    <a class="btn-floating btn-flat coloured coloured-background waves-effect reset-input" data-setting="${key}">
                      <i class="center material-icons prefix">refresh</i>
                    </a>
                  </div>`;

      }

      if (val.input === 'select') {

        let options = '';

        if (val.options && typeof(val.options) === 'object') {

          if (Array.isArray(val.options)) {

            $.each(val.options, function(key, val) {

              options += `<option value="${val}">${val}</option>`;

            });

          } else {

            $.each(val.options, function(key, val) {

              options += `<option value="${val}">${key}</option>`;

            });

          }

        } else {

          options = `
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                  `;

        }

        input = `
                  <select class="settings-input" name="${key}">${options}</select>
                  `;

        label = `
                  <label>${val.label}</label>
                  `;

      } else {

        label = `<label for="${key}">${val.label}${indicator}</label>`;

        switch (val.input) {

          case 'chips':
            input = `<div class="chips left-align settings-input" name="${key}" data-optional="${val.optional}"></div>`;
            break;
          case 'range':
            input = `<input type="range" name="${key}" class="settings-input" id="${key}" min="${val.min}" max="${val.max}">`;
            indicator = '';
            container = '<p class="range-field">';
            containerClose = '</p>';
            break;
          case 'checkbox':
            input = `<input type="checkbox" name="${key}" class="settings-input filled-in" id="${key}">`;
            indicator = '';
            container = '<p>';
            containerClose = '</p>';
            inputField = '';
            break;
          case 'switch':
            inputField = '';
            label = '';
            input = `
                      <label class="left">${val.label}</label><br>
                      <div class="switch left">
                        <label>
                          Off
                          <input type="checkbox" name="${key}" class="settings-input">
                          <span class="lever"></span>
                          On
                        </label>
                      </div>
                      <br><br>
                      `;
            break;
          case 'radio':
            input = `<label class="left">${val.label}</label><br>`;
            label = '';
            inputField = '';
            settingKey = key;
            if (val.options) {

              $.each(val.options, function(key, val) {

                input += `
                        <p>
                          <input type="radio" name="${settingKey}" class="settings-input" value="${val}" id="${settingKey}_${key}">
                          <label for="${settingKey}_${key}">${val}</label>
                        </p>
                        `;

              });

            } else {

              input += `
                      <p>
                        <input type="radio" name="${settingKey}" class="settings-input" value="false" id="${settingKey}_false">
                        <label for="${settingKey}_false">No</label>
                      </p>
                      <p>
                        <input type="radio" name="${settingKey}" class="settings-input" value="true" id="${settingKey}_true">
                        <label for="${settingKey}_true">Yes</label>
                      </p>
                      `;

            }
            break;
          default:
            input = `<input type="${val.input}" name="${key}" class="settings-input mousetrap" id="${key}" data-optional="${val.optional}">`;
            break;

        }

      }

      let mobile = val.mobile ? '' : 'hide-on-med-and-down';

      let html = `
                <div class="row ${mobile}">
                  <div class="${inputField} col ${inputCol}">
                    ${container}
                    ${input}
                    ${label}
                    ${containerClose}
                    <span class="tooltipped" data-setting="${key}" data-position="bottom" data-delay="50">What's This? | </span>
                    <a class="black-text settings-link default-button" data-setting="${key}"><b>Set to Default</b></a>
                  </div>
                  ${resetInput}
                </div>
                <br>
                `;

      if (settings.tabs) {

        if (settings.tabs.value.includes(val.tab)) {

          tabHTML[val.tab] += html;

        } else if (!val.tab) {

          moodEngine.log('warn', `${key} is missing a tab value, it will not be included in the modal.`);

        } else {

          moodEngine.log('warn', `${key} has a tab value '${val.tab}' that does not exist, it will not be included in the modal.`);

        }

      } else {

        fullHTML += html;

      }

    }

  });

  if (settings.tabs) {

    $.each(tabHTML, function(key, val) {

      $(`#tab-${key}`).html(val);

    });

    // Preselect last tab

    if (fullSettings.keep_tab) $(`.tab a[href="${localStorage.getItem('lastTab')}"]`).addClass('active')

    // Initialize Tabs

    $('ul.tabs').tabs();

  } else {

    $('#settings-form').html(fullHTML);

  }

  // Record dirty inputs

  $('.settings-input, .input').change(function() {

    if ($(this).is('[type="radio"]')) {

      $(this).closest('.row').find('[type="radio"]').addClass('dirty');

    } else {

      $(this).addClass('dirty');

    }

  });

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

  moodEngine.setInputs(null, 'initial');

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

    let value = `${settings[setting].description}<br>The default is ${text}.`
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

      // Keep the button menu closed
      $('.fixed-action-btn').openFAB();

    }

  });

  // When chips are added, clean up values in array

  $('.chips').on('chip.add', function(e, chip) {

    $(this).addClass('dirty');

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

    $(this).addClass('dirty');

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

  // Allows other functions to check if currently auto reloading

  moodEngine.notAutoReloading = function() {

    return $('main').hasClass('manual-reload');

  };

  let timeout;
  let autoReload;

  (autoReload = function() {

    timeout = setTimeout(function() {

      if (!moodEngine.notAutoReloading() && !appError) {

        moodEngine.reload('Auto');
        moodEngine.log('log', `Auto reloaded after ${fullSettings.reload_interval}ms.`);

      }

      autoReload();

    }, fullSettings.reload_interval);

  })();

  // Toggle auto reload when the button is clicked

  moodEngine.toggleAutoReload = function() {

    if (!appError) {

      let toggle = moodEngine.notAutoReloading() ? 'Enabled' : 'Disabled';
      let icon_text = moodEngine.notAutoReloading() ? 'close' : 'autorenew';
      let icon = $('#toggle-auto-reload i.main-icon');

      // Enabling

      if (moodEngine.notAutoReloading()) {

        $('#go-back-button').addClass('disabled');

        if (!timeout) {

          moodEngine.log('log', 'Setting timeout for auto reload.');

          timeout = setTimeout(function() {

            if (!moodEngine.notAutoReloading() && !appError) {

              moodEngine.reload('Auto');
              moodEngine.log('log', `Auto reloaded after ${fullSettings.reload_interval}ms.`);

            }

            autoReload();

          }, fullSettings.reload_interval);

        }

        // Disabling

      } else {

        moodEngine.log('log', 'Cleared auto reload timeout.');

        clearTimeout(timeout);
        timeout = null;

        if (quoteHistory.length > 1) $('#go-back-button').removeClass('disabled');

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

      moodEngine.setText(quote);
      moodEngine.setColour(`#${colour}`);

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

      moodEngine.setText(quotes[quote]);
      moodEngine.setColour(`#${colours[colour]}`);

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

      if (usedQuotes.length === quotes.length) usedQuotes = [];

      // If MoodEngine trys to use the same quote twice, or one that has already been used, generate a new one

      while (lastNum === quoteNum || usedQuotes.includes(quoteNum)) {

        quoteNum = Math.floor(quotes.length * Math.random());

      }

      // Add quote to used quotes, quote history and localStorage

      usedQuotes.push(quoteNum);
      quoteHistory.push(quoteNum);
      localStorage.setItem('lastQuote', quoteNum);

      let quote = quotes[quoteNum];

      // Display quote on the text element

      moodEngine.setText(quote);

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

      moodEngine.setColour(`#${colour}`);

      $('.fade-in-on-load').fadeIn();

      if (method !== 'Auto') $('#go-back-button').removeClass('disabled');
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
      if (totalLoadTime > 10000) {
        moodEngine.log('warn', 'Loading took very long, probably due to a slow connection.');
      }

      // If an error, display/log it

    } catch (error) {

      error = error.toString();
      moodEngine.error('Failed to initialize MoodEngine.', error, 3);

    }

  }

  $('.clickable').click(function(e) {

    moodEngine.reload();

  });

  // Manually choose the text and colour from the console

  moodEngine.manualReload = function(text, colour) {

    moodEngine.setText(text);
    moodEngine.setColour(`#${colour}`);

  };

  // Set all settings to default

  moodEngine.setAllDefault = function() {

    let restoreSettings = {};
    let cachedQuotes = localStorage.getItem('cachedQuotes');
    let cachedVersionQuotes = localStorage.getItem('cachedVersionQuotes');
    let cachedColours = localStorage.getItem('cachedColours');
    let lastQuote = localStorage.getItem('lastQuote');
    let lastColour = localStorage.getItem('lastColour');
    let lastTab = localStorage.getItem('lastTab');
    let verticalMenu = localStorage.getItem('vertical_menu');

    $.each(settings, function(key, val) {

      if (val.advanced) restoreSettings[key] = localStorage.getItem(key);

    });

    localStorage.clear();
    localStorage.setItem('cachedQuotes', cachedQuotes);
    localStorage.setItem('cachedVersionQuotes', cachedVersionQuotes);
    localStorage.setItem('cachedColours', cachedColours);
    localStorage.setItem('lastQuote', lastQuote);
    localStorage.setItem('lastColour', lastColour);
    localStorage.setItem('lastTab', lastTab);
    localStorage.setItem('vertical_menu', verticalMenu);

    $.each(restoreSettings, function(key, val) {

      if (fullSettings.keep_advanced_settings) {

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

      } else if ($(this).is('[type="radio"]')) {

        let name = $(this).attr('name');

        localSettings[name] = $(`.settings-input[name="${name}"]:checked`).val();

      } else {

        localSettings[$(this).attr('name')] = $(this).val();

      }

      // Detect if input is blank

      if (!$(this).is('select') && !$(this).is('[type="radio"]')) {

        $(this).addClass('invalid');

        if ($(this).attr('data-optional') !== '1' && ((!$(this).hasClass('chips') && !$(this).val() || $(this).val() === 'null') || $(this).hasClass('chips') && !$(this).material_chip('data').length)) {

          emptyInputs.push(` ${settings[$(this).attr('name')].label}`);
          $(this).next('label').attr('data-error', 'Can\'t be empty.');

        } else if ($(this).val().indexOf(' ') >= 0 && !$(this).is('select')) {

          spaceInputs.push(` ${settings[$(this).attr('name')].label}`);
          $(this).next('label').attr('data-error', 'Can\'t contain spaces.');

        } else {

          $(this).removeClass('invalid');
          $(this).next('label').attr('data-error', '');

        }

      }

      // Custom Validations

      if ($(this).val() && $(this).val().indexOf(' ') < 0) {

        // Backend Address

        if ($(this).attr('name') === 'backend_address' && $(this).val() !== backendAddress) {

          moodEngine.log('log', `Testing custom back-end address '${$(this).val()}'...`);

          $.ajaxSetup({
            async: false
          });

          $.getJSON(`${$(this).val()}/api/get/colours/index.php`).fail((data) => {

            let sslMessage = pageSSL && !$(this).val().startsWith('https://') ? ' Make sure it is SSL enabled.' : '';
            moodEngine.log('log', `Custom back-end address '${$(this).val()}' is invalid.`);
            $(this).addClass('invalid');
            $(this).next('label').attr('data-error', 'Address is invalid.');
            invalidInputs.push(`${settings[$(this).attr('name')].label} '${$(this).val()}' is Invalid.${sslMessage}`);

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

      // if ($(this).hasClass('chips')) {
      //
      //   let input = $(this);
      //   let name = settings[input.attr('name')].label;
      //
      //   $(this).find('.chip').each(function() {
      //
      //     if ($(this).contents().get(0).nodeValue.indexOf(' ') >= 0) {
      //
      //       input.addClass('invalid');
      //       invalidInputs.push(`Keyboard Shortcuts in ${name} Cannot Contain Spaces`);
      //
      //     }
      //
      //   });
      //
      // }

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

    if (e.shiftKey) window.location.reload();

  });

  // Forms are just for show, don't allow submitting

  $('form').submit(function() {

    return false;

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
      $('link[rel="icon"], link[rel="shortcut icon"]').attr('href', `assets/${version.toLowerCase()}_favicon.ico`);

      moodEngine.reload('Auto');
      moodEngine.rewind();

      moodEngine.log('log', `Switched version to ${version}.`);
      Materialize.toast(`Switched to ${version} Your Mood!`, fullSettings.toast_interval);

    }

  };

  // Log Searching

  $('#logs-search').on('keypress keydown keyup change', function() {

    $('#logs-search-results').empty();

    let value = $(this).val().toLowerCase();

    if (value) {

      $('#visible-logs').addClass('hide');

      let string = '';
      let results = 0;

      $('.log').each(function() {

        if ($(this).find('.content').text().toLowerCase().includes(value)) {

          string += `${$(this).html()}<br>`;
          results++;

        }

      });

      if (results) {

        $('#logs-search-results').html(string);

      } else {

        $('#logs-search-results').html('<h5>No Results</h5>');

      }

      $('#results-number').text(` (${results})`);

    } else {

      $('#visible-logs').removeClass('hide');
      $('#results-number').empty();

    }

  });

});
