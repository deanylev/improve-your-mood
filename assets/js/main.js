let appError, defaultMode, startTime, modalOpen, lastNum, disableSwitch, quoteNum, colourNum, isProd, userCheck;
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
let profileSettings = {};
let pullTime = {};
let versionQuotes = {};
let currentUser = {};
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

    if (display !== false) console[type](`\n${message}`);

    $('#visible-logs').empty();

    $.each(moodLog, function(key, val) {

      $('#visible-logs').append(`<div class="log"><b><span class="log-${val.type}">${val.type}:</span></b> <div class="content">${val.message}</div></div><br>`);

    });

  } else {

    console.error('INCORRECT USE OF MOODENGINE LOG');

  }

};

moodEngine.sendLogs = function(method, amount) {

  //if (localStorage.length) moodEngine.log('log', `localStorage: ${JSON.stringify(localStorage)}`, false);

  amount = amount || 1;

  console.log('\nSending logs to backend...');

  if (method === 'button') moodEngine.notify('Sending Logs To Back-End...');

  for (i = 0; i < amount; i++) {

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
        if (method === 'button') moodEngine.notify('Logs Sent To Back-End Successfully.');

      },
      error: function(response) {

        console.log('\nFailed to send logs to backend.');
        if (method === 'button') moodEngine.notify('Failed To Send Logs to Back-End.');

      }
    });

  }

};

moodEngine.notify = (message, interval) => {

  interval = interval || fullSettings.toast_interval;
  Materialize.toast(message, interval);

};

$(window).on('error', function(error) {

  moodEngine.error(null, `${error.originalEvent.message} (LINE NUMBER: ${error.originalEvent.lineno})`, '0');

  if (localStorage.length) {

    localStorage.clear();

    $('#error-message').text('Your settings have been cleared to try resolve the issue, reloading in 2 seconds...');

    setTimeout(() => {

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

  $('link[rel="icon"], link[rel="shortcut icon"]').attr('href', `assets/${version.toLowerCase()}_favicon.ico`);

  $('#year').append(new Date().getFullYear());

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

// Function for setting theme

moodEngine.setTheme = function(colour) {

  $('.theme-text').css('cssText', `color: ${colour} !important`);
  $('.js-margin').css('margin-top', $(document).height() / 4.5);

}

// Function for displaying and logging errors

moodEngine.error = function(display, log, code, type) {

  moodEngine.setColour('black');
  moodEngine.setTheme('white');
  $('#quote').addClass('scale-in');
  $('.preloader-wrapper').addClass('hide');
  $('.fixed-action-btn').addClass('hide');

  // If network connection is detected

  if (navigator.onLine || type !== 'backend') {

    display = display || 'An error occured.';

    log = log || 'An error occured.';

    if (code) $('#error-message').text(`${log} (${code})`);

    $('#quote').text(display);

    moodEngine.log('error', log);

    if (type === 'backend' && localStorage.getItem('backend_address')) {

      localStorage.removeItem('backend_address');
      $('#error-message').text('Back-end address reset, reloading in 2 seconds...');

      setTimeout(() => {

        window.location.reload();

      }, 2000);

    }

  } else {

    $('#quote').text('You are not connected to the internet.');
    moodEngine.log('log', 'No internet connection.');

  }

  appError = true;

  moodEngine.sendLogs();

};

console.log(`%c${version.toLowerCase()} your mood 6`, 'font-family: "Oxygen"; font-size: 20px;');
console.log('――――――――――――――――――――――――――――――');
moodEngine.log('log', `Pulling from: ${backendAddress}`);

$.get(`${backendAddress}/api/verify/url/index.php`, (data) => {

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

    }).fail((data) => {

      disableSwitch = true;
      moodEngine.log('warn', `Error fetching ${otherVersion} quotes, disabling switch feature.`);

    });

    moodEngine.log('log', `Successfully pulled ${quotes.length} quotes from backend in ${pullTime.quotes}ms.`);

    if (localStorage.getItem('disable_caching') !== 'true' && quotes.length > 1) {

      localStorage.setItem('cachedQuotes', JSON.stringify(quotes));

      if (versionQuotes[otherVersion].length > 1) {

        localStorage.setItem('cachedVersionQuotes', JSON.stringify(versionQuotes));

      } else {

        disableSwitch = true;

      }

      moodEngine.log('log', 'Cached quotes for next load.');

    } else {

      localStorage.removeItem('cachedQuotes');
      localStorage.removeItem('cachedVersionQuotes');

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

    if (localStorage.getItem('disable_caching') !== 'true' && colours.length > 1) {

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

  moodEngine.log('error', 'Failed to pull settings from backend.');

  if (localStorage.getItem('cachedSettings')) {

    moodEngine.log('warn', 'Using cached settings...');
    settings = JSON.parse(localStorage.getItem('cachedSettings'));

  } else {

    $.ajaxSetup({
      async: false
    });

    moodEngine.log('warn', 'No cached settings, running in default settings mode...');

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

  }

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

  if (localStorage.getItem('disable_caching') !== 'true' && Object.keys(settings).length) {

    localStorage.setItem('cachedSettings', JSON.stringify(settings));

    moodEngine.log('log', 'Cached settings for next load (if needed).');

  } else {

    localStorage.removeItem('cachedSettings');

  }

  // Delete setting from profile

  moodEngine.removeProfileSetting = function(setting) {

    delete profileSettings[setting];

    $.ajax({
      data: {
        id: currentUser.id,
        settings: JSON.stringify(profileSettings)
      },
      method: 'POST',
      url: `api/update/user_settings/index.php`,
      success: function(response) {
        if (response === 'success') {
          moodEngine.log('log', `Cleared setting '${setting}' from profile.`);
          moodEngine.checkUser();
        } else {
          moodEngine.profileError(response);
        }
      },
      error: function(response) {
        moodEngine.profileError('Failed to clear setting.');
        moodEngine.log('error', `Failed to clear setting '${setting}' from profile.`);
      }
    });

  }

  // Check current user

  moodEngine.checkUser = (method) => {

    if (method === 'initial') {

      $.ajaxSetup({
        async: false
      });

    }

    $.get(`api/get/current_user/index.php`, (data) => {

      profileSettings = {};

      // Log out

      if (data === 'no user') {

        $('.logged-in').addClass('hide');
        $('.not-logged-in').removeClass('hide');
        $('#current-user').empty();
        $('#current-user-image').removeAttr('src');
        currentUser = {};

      } else {

        // Log in

        if (method !== 'initial') moodEngine.profileError();
        $('.not-logged-in').addClass('hide');
        $('.logged-in').removeClass('hide');
        $('.signup').addClass('also-hide');

        let name = currentUser.name;

        currentUser = data;

        if (name !== currentUser.name) {

          moodEngine.log('log', `Logged in as '${currentUser.name}'.`);
          $('#current-user').html(`<a href="admin/view/?type=users&amp;title=user&amp;id=${currentUser.id}" target="_blank">${currentUser.name}</a>`);
          $('#current-user-image').attr('src', `admin/users/image.php?id=${currentUser.id}`);

        }

        $('#saved-settings h5').addClass('hide');
        $('button.clear-settings').addClass('hide');
        $('#saved-settings p').empty();

        try {

          $.each(JSON.parse(data.settings), (key, val) => {

            $('#saved-settings h5').removeClass('hide');
            $('button.clear-settings').removeClass('hide');

            try {

              val = JSON.parse(val);

            } catch (error) {}

            profileSettings[key] = val;

            $('#saved-settings p').append(`<div><b>${key}:</b> ${val}<a class="delete-saved-setting" data-setting="${key}">&times;</a><br></div>`);

          });

        } catch (error) {}

      }

      $('.delete-saved-setting').off();
      $('.delete-saved-setting').click(function() {

        let setting = $(this).attr('data-setting');
        moodEngine.removeProfileSetting(setting);

      });

      if (method !== 'initial') moodEngine.setSettings('userCheck');

    });

    $.ajaxSetup({
      async: true
    });

  }

  moodEngine.checkUser('initial');

  $('.manual-check').click(moodEngine.checkUser);

}).always((data) => {

  // Construct settings object from backend or local

  moodEngine.setSettings = function(method, toast) {

    let buttonOrder;

    if (method !== 'initial') buttonOrder = JSON.stringify(fullSettings.button_order);

    let userSettings = 0;
    let userPSettings = 0;
    let backendSettings = 0;

    let currentSettings = {};
    let logs = [];

    if (method !== 'initial') {

      $.each(fullSettings, function(key, val) {

        currentSettings[key] = val;

      });

    }

    $('.profile-settings-button.save-settings').addClass('hide');

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

        fullSettings[key] = profileSettings[key] !== undefined ? profileSettings[key] : settings[key].value;

        profileSettings[key] !== undefined ? userPSettings++ : backendSettings++;

      }

      if (method !== 'initial' && JSON.stringify(fullSettings[key]) !== JSON.stringify(currentSettings[key])) {

        $(`.settings-input[name="${key}"]`).addClass('dirty');

        let currentValue = ['object', 'string'].includes(typeof(currentSettings[key])) ? JSON.stringify(currentSettings[key]) : currentSettings[key];
        let newValue = ['object', 'string'].includes(typeof(fullSettings[key])) ? JSON.stringify(fullSettings[key]) : fullSettings[key];

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
        fullSettings.button_order = ['autoreload', 'settings', 'profile', 'speak', 'rewind'];

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
          case 'profile':
            html = `<li data-button="profile"><a class="btn-floating menu-button waves-effect transparent" id="profile-button"><i class="material-icons main-icon ignore theme-text" data-icon="profile" data-default="person"></i><i class="material-icons alt-icon ignore theme-text hide" data-icon="logout" data-default="exit_to_app"></i></a></li>`;
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

      $('#profile-button').click(function(e) {

        if (!appError) e.shiftKey ? moodEngine.logOut() : moodEngine.toggleProfile();

      })

      $('#speak-quote-button').click(function() {

        if (!appError) {

          try {

            responsiveVoice.speak($('#quote').text(), fullSettings.speak_voice_accent);

          } catch (error) {

            moodEngine.log('error', `Cannot speak quote, invalid voice accent provided ('${fullSettings.speak_voice_accent}').`);
            moodEngine.notify('Invalid Voice Accent Provided.')

          }

        }

      });

      $('#go-back-button').click(function(e) {

        e.shiftKey ? moodEngine.fullRewind() : moodEngine.rewind();

      });

      fabOpen ? $('.fixed-action-btn').openFAB() : $('.fixed-action-btn').closeFAB();

    }

    // Theme colour

    moodEngine.setTheme(fullSettings.theme_colour);

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

    // Check user automatically

    clearInterval(userCheck);

    if (fullSettings.user_check_interval) {

      if (fullSettings.user_check_interval >= 1000) {

        userCheck = setInterval(moodEngine.checkUser, fullSettings.user_check_interval);

      } else {

        let location;

        if (localStorage.getItem('user_check_interval')) {

          localStorage.removeItem('user_check_interval');
          location = 'local';

        } else {

          moodEngine.removeProfileSetting('user_check_interval');
          location = 'profile';

        }

        moodEngine.error(null, `User check interval is too low. Cleared from your ${location} settings.`, 4);

        setTimeout(() => {

          window.location.reload();

        }, 2000)

      }

    }

    // Keyboard shortcuts

    Mousetrap.reset();

    // Shift click icons

    Mousetrap.bind(['shift'], function(e) {

      $('.menu-button').each(function() {

        $(this).find('.main-icon:not(.ignore)').addClass('hide');
        $(this).find('.alt-icon:not(.ignore)').removeClass('hide');

      });

    }, 'keydown');

    Mousetrap.bind(['shift'], function(e) {

      $('.menu-button').each(function() {

        $(this).find('.main-icon').removeClass('hide');
        $(this).find('.alt-icon').addClass('hide');

      });

    }, 'keyup');

    // Change Tabs

    function canChange() {

      return !appError && modalOpen && !$('#settings-modal input:focus').length && !$('.chip.selected').length;

    }

    Mousetrap.bind(['+left'], function(e) {

      if (canChange()) {

        try {

          $('ul.tabs').tabs('select_tab', $('.tab .active').parent().prev('.tab').find('a').attr('href').substr(1));

        } catch (error) {

          $('ul.tabs').tabs('select_tab', $('.tab').last().find('a').attr('href').substr(1));

        }

      }

    });

    Mousetrap.bind(['+right'], function(e) {

      if (canChange()) {

        try {

          $('ul.tabs').tabs('select_tab', $('.tab .active').parent().next('.tab').find('a').attr('href').substr(1));

        } catch (error) {

          $('ul.tabs').tabs('select_tab', $('.tab').first().find('a').attr('href').substr(1));

        }

      }

    });

    // Save Settings

    Mousetrap.bindGlobal(['+enter'], function(e, combo) {

      if (modalOpen && $('#settings-modal').hasClass('open') && (!$('#settings-modal input:focus').parent().hasClass('chips') || !$('#settings-modal input:focus').val())) {

        moodEngine.saveSettings();

      }

    });

    // Reload

    if (typeof(fullSettings.reload_keys) === 'object') {

      Mousetrap.bindGlobal(fullSettings.reload_keys, function(e, combo) {

        if (!appError && !modalOpen) {

          moodEngine.reload();

        }

      });

    }

    // Rewind + Full Rewind

    if (typeof(fullSettings.back_keys) === 'object') {

      Mousetrap.bind(fullSettings.back_keys, function(e) {

        if (!appError && !modalOpen) moodEngine.rewind();

      });

      Mousetrap.bind(fullSettings.back_keys.map(k => `shift+${k}`), function(e) {

        if (!appError && !modalOpen) moodEngine.fullRewind();

      });

    }

    // Toggle Auto Reload + Switch Version

    if (typeof(fullSettings.auto_reload_keys) === 'object') {

      Mousetrap.bind(fullSettings.auto_reload_keys, function(e) {

        if (!appError && !modalOpen) moodEngine.toggleAutoReload();

      });

      Mousetrap.bind(fullSettings.auto_reload_keys.map(k => `shift+${k}`), function(e) {

        if (!appError && !modalOpen) moodEngine.switchVersion();

      });

    }

    // Toggle Button Menu + Change Button Menu Orientation

    if (typeof(fullSettings.menu_keys) === 'object') {

      Mousetrap.bind(fullSettings.menu_keys, function(e) {

        if (!appError && !modalOpen) {

          $('.fixed-action-btn').hasClass('active') ? $('.fixed-action-btn').closeFAB() : $('.fixed-action-btn').openFAB();

        }

      });

      Mousetrap.bind(fullSettings.menu_keys.map(k => `shift+${k}`), function(e) {

        if (!appError && !modalOpen) moodEngine.changeMenuOrientation();

      });

    }

    // Toggle Settings Panel

    if (typeof(fullSettings.settings_keys) === 'object') {

      Mousetrap.bindGlobal(fullSettings.settings_keys, function(e) {

        if (!appError && !$('#settings-modal input:not([type="range"]):not([type="checkbox"]):focus').length) moodEngine.toggleSettings();

      });

      Mousetrap.bindGlobal(fullSettings.settings_keys.map(k => `shift+${k}`), function(e) {

        if (!appError && !modalOpen) moodEngine.setAllDefault();

      });

    }

    // View Logs

    if (typeof(fullSettings.view_logs_keys) === 'object') {

      Mousetrap.bindGlobal(fullSettings.view_logs_keys, function(e) {

        if (!appError && !modalOpen) $('#logs-modal').modal('open');

      });

    }

    // Toggle Profile Panel

    if (typeof(fullSettings.profile_keys) === 'object') {

      Mousetrap.bindGlobal(fullSettings.profile_keys, function(e) {

        if (!appError && !$('#profile-modal input:not([type="range"]):not([type="checkbox"]):focus').length) moodEngine.toggleProfile();

      });

      Mousetrap.bind(fullSettings.profile_keys.map(k => `shift+${k}`), function(e) {

        if (!appError) moodEngine.logOut();

      });

    }

    if (!['initial', 'userCheck'].includes(method)) {

      moodEngine.toggleSettings('close');

      moodEngine.notify(toast);

      if (fullSettings.backend_address !== backendAddress) {

        localStorage.clear();
        localStorage.setItem('backend_address', fullSettings.backend_address);
        if (fullSettings.backend_address !== 'https://improveyourmood.xyz') localStorage.setItem('keep_advanced_settings', true);
        window.location.reload();

      }

    }

    if (method !== 'initial' && currentSettings.reload_interval !== fullSettings.reload_interval && !moodEngine.notAutoReloading()) moodEngine.toggleAutoReload();

    if ((userSettings || backendSettings || profileSettings) && method !== 'userCheck') moodEngine.log('log', `Settings set successfully. ${userSettings} user defined, ${userPSettings} profile defined, ${backendSettings} backend defined.`);

    if (userSettings) $('.profile-settings-button.save-settings').removeClass('hide');

    if (!['initial', 'userCheck'].includes(method) && logs.length) {

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
    let logInputs = false;

    if (input) {

      target = `.settings-input[name="${input}"]`;

    } else if (method === 'initial') {

      target = '.settings-input:not(.select-wrapper)';

    } else if ($('.dirty').length) {

      target = '.settings-input.dirty:not(.select-wrapper)';
      logInputs = true;

    } else {

      success = false;

    }

    let log = success ? `Inputs set successfully, target was '${target}'.` : 'No inputs to set.';
    moodEngine.log('log', log);

    let setInputs = [];

    $(target).each(function() {

      $(this).removeClass('dirty');

      let setting = $(this).attr('name');
      let value = fullSettings[setting];

      setInputs.push(setting);

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
        let amount = max > 250 ? max / 250 : 1;
        let currentValue = Math.ceil((parseInt(input.val()) + 1) / amount) * amount;
        let method = currentValue > value ? 'decrease' : 'increase';

        input.attr('disabled', true);

        let interval = setInterval(() => {

          method === 'decrease' ? currentValue -= amount : currentValue += amount;

          input.val(currentValue);

          if ((method === 'decrease' && currentValue <= value) || (method === 'increase' && currentValue >= value)) {

            clearInterval(interval);
            input.val(value);
            input.removeAttr('disabled');

          }

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

    if (logInputs) moodEngine.log('log', `Affected inputs were: ${setInputs.join(', ')}`);

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

  $('#profile-modal').modal({
    ready: function(modal, trigger) {

      modalOpen = true;

    },
    complete: function() {

      modalOpen = false;

    }
  });

  // Function for closing and opening settings panel

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

  // Function for closing and opening profile panel

  moodEngine.toggleProfile = function(action) {

    if (action) {

      $('#profile-modal').modal(action);

    } else {

      modalOpen ? $('#profile-modal').modal('close') : $('#profile-modal').modal('open');

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

  // Set correct input values

  moodEngine.setInputs(null, 'initial');

  // Add defaults to tooltips

  $('.tooltipped').each(function() {

    let setting = $(this).attr('data-setting');
    let text = Array.isArray(settings[setting].value) ? settings[setting].value.join(', ') : settings[setting].value;;
    let value = `${settings[setting].description}<br>The default is ${text}.`;

    $(this).attr('data-tooltip', value);

    // Initialize the Materialize tooltip plugin

    $('.tooltipped').tooltip({
      html: true
    });

  });

  moodEngine.changeMenuOrientation = function() {

    $('.fixed-action-btn').toggleClass('horizontal');
    $('#menu-button .alt-icon').toggleClass('inactive-icon');

    localStorage.setItem('vertical_menu', !$('.fixed-action-btn').hasClass('horizontal'));

    // Keep the button menu closed
    $('.fixed-action-btn').openFAB();

  };

  // Menu Button

  $('#menu-button').click(function(e) {

    if (e.shiftKey) moodEngine.changeMenuOrientation();

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

  let timeout, autoReload;

  // Toggle auto reload when the button is clicked

  moodEngine.toggleAutoReload = function() {

    if (!appError) {

      let toggle = moodEngine.notAutoReloading() ? 'Enabled' : 'Disabled';
      let icon_text = moodEngine.notAutoReloading() ? 'close' : 'autorenew';
      let icon = $('#toggle-auto-reload i.main-icon');

      try {

        // Enabling

        if (moodEngine.notAutoReloading()) {

          if (typeof(fullSettings.reload_interval) !== 'number') throw new Error('Reload interval is not a number.');

          $('#go-back-button').addClass('disabled');

          moodEngine.log('log', `Set timeout for auto reload to ${fullSettings.reload_interval}ms.`);

          (autoReload = function() {

            timeout = setTimeout(() => {

              if (!moodEngine.notAutoReloading() && !appError) moodEngine.reload('Auto');

              autoReload();

            }, fullSettings.reload_interval);

          })();

          // Disabling

        } else {

          moodEngine.log('log', 'Cleared auto reload timeout.');

          clearTimeout(timeout);

          if (quoteHistory.length > 1) $('#go-back-button').removeClass('disabled');

        }

        icon.text(icon_text);
        $('main').toggleClass('manual-reload');
        moodEngine.notify(`Auto Reload ${toggle}!`);

      } catch (error) {

        moodEngine.notify(`Failed To Enable Auto Reload.`);
        moodEngine.log('error', `Couldn't enable auto reload. ${error}`);

      }

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
      $('.fixed-action-btn').removeClass('hide');
      moodEngine.log('log', 'MoodEngine initialized.');
      let totalLoadTime = Math.ceil(performance.now() - totalTime);
      moodEngine.log('log', `Total load time: ${totalLoadTime}ms.`);
      if (totalLoadTime > 10000) moodEngine.log('warn', 'Loading took very long, probably due to a slow connection.');

      // If an error, display/log it

    } catch (error) {

      error = error.toString();
      moodEngine.error('Failed to initialize MoodEngine.', error, 3);

    }

  }

  $('.clickable').click(function() {

    moodEngine.reload();

  });

  // Manually choose the text and colour from the console

  moodEngine.manualReload = function(text, colour) {

    moodEngine.setText(text);
    moodEngine.setColour(`#${colour}`);

  };

  // Set all settings to default

  moodEngine.setAllDefault = function() {

    $.each(settings, function(key, val) {

      if (!(val.advanced && fullSettings.keep_advanced_settings)) localStorage.removeItem(key);

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
    let noSave;

    $('.settings-input:not(.select-wrapper)').each(function() {

      let name = $(this).attr('name');

      // Construct the object using values

      if ($(this).hasClass('chips')) {

        let array = [];

        $.each($(this).material_chip('data'), function(key, val) {

          array.push(val.tag);

        });

        localSettings[name] = JSON.stringify(array);

      } else if ($(this).is('[type="checkbox"]')) {

        localSettings[name] = $(this).is(':checked');

      } else if ($(this).is('[type="radio"]')) {

        localSettings[name] = $(`.settings-input[name="${name}"]:checked`).val();

      } else {

        localSettings[name] = $(this).val();

      }

      // Detect if input is blank

      if (!$(this).is('select') && !$(this).is('[type="radio"]')) {

        $(this).addClass('invalid');

        if ($(this).attr('data-optional') !== '1' && ((!$(this).hasClass('chips') && !$(this).val() || $(this).val() === 'null') || $(this).hasClass('chips') && !$(this).material_chip('data').length)) {

          emptyInputs.push(` ${settings[name].label}`);
          $(this).next('label').attr('data-error', 'Can\'t be empty.');

        } else if ($(this).val().indexOf(' ') >= 0 && !$(this).is('select')) {

          spaceInputs.push(` ${settings[name].label}`);
          $(this).next('label').attr('data-error', 'Can\'t contain spaces.');

        } else {

          $(this).removeClass('invalid');
          $(this).next('label').attr('data-error', '');

        }

      }

      // Custom Validations

      if ($(this).val() && $(this).val().indexOf(' ') < 0) {

        // Backend Address

        if (name === 'backend_address' && $(this).val() !== backendAddress) {

          if (!$(this).val().startsWith('http://') && !$(this).val().startsWith('https://')) {

            let prefix = $(this).val() === 'improveyourmood.xyz' || pageSSL ? 'https://' : 'http://';
            $(this).val(prefix + $(this).val());
            noSave = true;
            moodEngine.saveSettings();

          } else if (pageSSL && $(this).val().startsWith('http://')) {

            invalidInputs.push(`${settings[name].label} Must Be SSL Enabled.`);

          } else {

            moodEngine.log('log', `Testing custom back-end address '${$(this).val()}'...`);

            $.ajaxSetup({
              async: false
            });

            $.getJSON(`${$(this).val()}/api/get/colours/index.php`).fail((data) => {

              let sslMessage = pageSSL && !$(this).val().startsWith('https://') ? ' Make Sure It Is SSL Enabled.' : '';
              moodEngine.log('warn', `Custom back-end address '${$(this).val()}' is invalid.`);
              $(this).addClass('invalid');
              $(this).next('label').attr('data-error', 'Address is invalid.');
              invalidInputs.push(`${settings[name].label} '${$(this).val()}' Is Invalid.${sslMessage}`);

            });

            $.ajaxSetup({
              async: true
            });

          }

        }

        // Button Order

        if (name === 'button_order' && settings.button_order.value.includes('settings') && !localSettings.button_order.includes('settings')) {

          $(this).addClass('invalid');
          invalidInputs.push(`${settings[name].label} Needs to Include Settings`);

        }

        // User Check interval

        if (name === 'user_check_interval' && parseInt($(this).val()) && $(this).val() < 1000) {

          $(this).addClass('invalid');
          invalidInputs.push(`${settings[name].label} Must Be Either 0 or 1000+`);

        }

      }

    });

    // If all inputs are not blank nor invalid

    if (!spaceInputs.length && !emptyInputs.length && !invalidInputs.length && !noSave) {

      try {

        $.each(localSettings, function(key, val) {

          let length = JSON.stringify(val).length;

          if (length > 500) throw new Error(`Excessively long value length of ${length}.`);

          // If the set value is the same as the default, just remove it from localStorage and use backend value

          if (val === settings[key].value || val === JSON.stringify(settings[key].value) || `[${val}]` === JSON.stringify(settings[key].value)) {

            localStorage.removeItem(key);

            // Otherwise set it in localStorage

          } else {

            localStorage.setItem(key, val);

          }

        });

        //throw new Error();

        // Set settings for new ones to come into effect

        moodEngine.setSettings(null, 'Settings Saved!');
        moodEngine.toggleSettings('close');

        // Catch any unexpected errors and display/log them

      } catch (error) {

        moodEngine.notify('Unable to Save Settings. An Error Occurred.');
        moodEngine.log('error', `Couldn't save settings. ${error}`);

      }

    } else {

      if (spaceInputs.length) {

        if (spaceInputs.length === 1) {

          moodEngine.notify(`${spaceInputs} Contains Spaces.`);

        } else {

          moodEngine.notify(`${spaceInputs.length} Fields Contain Spaces.`);

        }

      }

      if (emptyInputs.length) {

        if (emptyInputs.length === 1) {

          moodEngine.notify(`${emptyInputs} Is Empty.`);

        } else {

          moodEngine.notify(`${emptyInputs.length} Fields Are Empty.`);

        }

      }

      if (invalidInputs.length) {

        $.each(invalidInputs, function(key, val) {

          moodEngine.notify(val);

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
      moodEngine.notify(`Switched to ${version} Your Mood!`);

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

  moodEngine.profileError = function(error) {

    if (error) {

      $('#profile-error').text(error);
      $('#clear-profile-error').removeClass('hide');

    } else {

      $('#profile-error').empty();
      $('.validation-errors').empty();
      $('#clear-profile-error').addClass('hide');

    }

  }

  $('#clear-profile-error').click(function() {

    moodEngine.profileError();

  });

  moodEngine.goToLogin = function() {

    moodEngine.profileError();
    $('.signup').addClass('hide-also');
    $('.login').removeClass('hide-also');

  }

  $('#go-to-login').click(function() {

    moodEngine.goToLogin();

  });

  $('#go-to-signup').click(function() {

    moodEngine.profileError();
    $('.login').addClass('hide-also');
    $('.signup').removeClass('hide-also');

  });

  // User Signup

  moodEngine.signUp = function() {

    $('.validation-errors').empty();

    moodEngine.profileError();

    $.ajax({
      data: $('#signup').serialize(),
      method: 'POST',
      url: `admin/signup/signup.php`,
      success: function(response) {
        try {

          response = JSON.parse(response);

          $.each(response, function(key, val) {
            let field = Object.keys(val)[0];
            let append = $(`.validation-errors[data-field="${field}"]`).is(':empty') ? val[field] : `<br>${val[field]}`;
            $(`.validation-errors[data-field="${field}"]`).append(append);
          });

        } catch (error) {

          moodEngine.checkUser();
          $('.signup').addClass('hide-also');

        }
      }
    });

  }

  $('#profile-signup-button').click(moodEngine.signUp);

  // User Login

  moodEngine.logIn = function() {

    moodEngine.profileError();
    $('li[data-button="profile"] i').removeClass('ignore');

    $.ajax({
      data: $('#login').serialize(),
      method: 'POST',
      url: `admin/login/authenticate.php`,
      success: function(response) {
        if (response === 'success') {

          moodEngine.checkUser();

        } else {

          moodEngine.profileError(response);

        }
      }
    });

  }

  $('#profile-login-button').click(moodEngine.logIn);

  $('#login').keydown(function(e) {

    if (e.keyCode === 13) moodEngine.logIn();

  });

  $('#signup').keydown(function(e) {

    if (e.keyCode === 13) moodEngine.signUp();

  });

  // User Logout

  moodEngine.logOut = function() {

    moodEngine.profileError();
    moodEngine.goToLogin();
    $('li[data-button="profile"] .main-icon').removeClass('hide')
    $('li[data-button="profile"] .alt-icon').addClass('hide')
    $('li[data-button="profile"] i').addClass('ignore');

    let logoutSequence = setInterval(() => {

      if (!Object.keys(currentUser).length) {

        clearInterval(logoutSequence);
        moodEngine.log('log', 'Logged out.');

      } else {

        $.ajax({
          data: {
            no_message: true
          },
          method: 'POST',
          url: `admin/logout/index.php`,
          success: function() {
            moodEngine.checkUser();
          },
          error: function() {
            moodEngine.profileError('Failed to log out.');
            moodEngine.log('error', 'Failed to log out.')
          }
        });

      }

    }, 400);

  }

  $('#profile-logout-button').click(moodEngine.logOut);

  $('.profile-settings-button').click(function() {

    let object = {};
    let successLog;
    let successToast;
    let failLog;

    if ($(this).hasClass('clear-settings')) {

      successLog = 'Successfully cleared settings from profile.';
      successToast = 'Settings Cleared Successfully!';
      failLog = 'Failed to clear settings from profile.';

    } else {

      successLog = 'Successfully saved settings to profile.';
      successToast = 'Settings Saved Successfully!';
      failLog = 'Failed to save settings to profile.';

      $.each(localStorage, (key, val) => {

        if (settings[key]) object[key] = val;

      });

    }

    $.ajax({
      data: {
        id: currentUser.id,
        settings: JSON.stringify(object)
      },
      method: 'POST',
      url: `api/update/user_settings/index.php`,
      success: function(response) {
        if (response === 'success') {
          moodEngine.log('log', successLog);
          moodEngine.notify(successToast);
          moodEngine.checkUser();
        } else {
          moodEngine.profileError(response);
        }
      },
      error: function(response) {
        moodEngine.profileError(failLog);
        moodEngine.log('error', failLog);
      }
    });

  });

});
