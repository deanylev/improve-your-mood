$('tbody').parents('.table-responsive').find('tr:odd').addClass('odd');

$('.pre-loader').addClass('d-none');
$('.show-on-load').removeClass('d-none');

$('form').submit(function() {

  if ($(this).hasClass('errors')) return false;

});

if (!$('.action-button').length) $('.actions').remove();

let lastChecked = null;
let checkBoxes = $('.item:not(.d-none) .select-checkbox');

$('#select-all-checkbox').click(function() {

  let checked = !!$('.item:not(.d-none) .select-checkbox:not(:checked)').length;
  checkBoxes.prop('checked', checked);
  checkBoxes.first().change();

});

checkBoxes.click(function(e) {

  if (!lastChecked) {

    lastChecked = this;
    return;

  }

  if (e.shiftKey) {

    let start = checkBoxes.index(this);
    let end = checkBoxes.index(lastChecked);

    checkBoxes.slice(Math.min(start, end), Math.max(start, end) + 1).prop('checked', lastChecked.checked);

  }

  lastChecked = this;

});

checkBoxes.change(function() {

  let checked = $('.select-checkbox:checked').length;
  let plural = checked === 1 ? '' : 's';
  let number = checked === 1 ? 'a' : checked;

  $('#select-multiple-input').remove();

  $('.multiple-item-button').addClass('d-none');
  $('#import').removeClass('d-none');

  if (checked) {

    $('.multiple-item-button').removeClass('d-none');
    $('#import').addClass('d-none');
    $('#select-multiple-form').append('<input id="select-multiple-input" type="hidden" name="deletemultiple" value="true">');
    $('.selected-number').text(checked);

  }

  $('#select-all-checkbox').prop('checked', checked === $('.select-checkbox').length);

  $('#delete-selected-button').attr('data-confirm', `deleting ${number} ${$('#delete-selected-button').attr('data-title')}${plural}`);

});

let originalResults = parseInt($('#results-number').text());

function search() {

  $('.filler').remove();
  $('.preview').addClass('d-none');
  $('.no-results').remove();

  let field = $('select[name="field"]').val();
  let query = $('select[name="query"]').val();
  let search = $('#search-bar').val();
  let caseSensitive = $('#case-sensitive').is(':checked');
  let results = 0;

  if (!caseSensitive) search = search.toLowerCase();

  if (search) {

    $('.item').addClass('d-none');

    if (search.toLowerCase() === 'null' && query === 'equals') {

      search = null;
      $('#search-bar').addClass('text-danger');

    } else {

      $('#search-bar').removeClass('text-danger');

    }

    $('.item').each(function() {

      let itemFieldFull = $(this).attr(`data-${field}`)
      let itemField = caseSensitive ? itemFieldFull : itemFieldFull.toLowerCase();

      if (
        (query === 'contains' && itemField.includes(search)) ||
        (query === 'equals' && (itemField === search || (search === null && itemField === ''))) ||
        (query === 'startswith' && itemField.startsWith(search)) ||
        (query === 'endswith' && itemField.endsWith(search))
      ) {

        $(this).removeClass('d-none');

        if (query !== "equals") {

          let preview = $(this).find('.preview');

          $('.preview').removeClass('d-none');
          preview.text(itemFieldFull);

          if (query === 'contains') {

            preview.mark(search, {
              separateWordSearch: false,
              caseSensitive: caseSensitive
            });

          } else if (query === 'startswith') {

            preview.markRanges([{
              start: 0,
              length: search.length
            }]);

          } else if (query === 'endswith') {

            preview.markRanges([{
              start: itemFieldFull.length - search.length,
              length: search.length
            }]);

          }

        }

        results++;

      } else {

        $(this).after('<tr class="filler d-none"></tr>');

      }

    });

    $('#results-number').text(results);
    if (!results) $('table').after('<div class="text-center no-results"><br><h3>No Results</h3><br><br></div>');

  } else {

    $('.item').removeClass('d-none');
    $('#results-number').text(originalResults);

  }

  checkBoxes = $('.item:not(.d-none) .select-checkbox');

  $('tr').removeClass('odd');
  $('tbody').parents('.table-responsive').find('tr:odd').addClass('odd');

}

if ($('#search-bar').val()) search();

$('#search-bar, select[name], #case-sensitive').on('keypress keydown keyup change', function() {

  search();
  window.history.pushState(null, null, `?type=${$('html').data('type')}&items=${$('html').data('items')}&s=${encodeURIComponent($('#search-bar').val())}&f=${$('select[name="field"]').val()}&q=${$('select[name="query"]').val()}&c=${$('#case-sensitive').is(':checked')}`);

});

$('.submit').click(function() {

  let action = $(this).attr('data-action');
  let bsClass = $(this).attr('data-class');
  let undo = $(this).attr('data-undo') === 'true' ? 'You will be able to undo this action.' : 'You will not be able to undo this action.';
  let extra = $(this).attr('data-extra') || '';
  let confirm = `You are ${$(this).attr('data-confirm')}. ${undo} ${extra}`;
  let form = action === 'deletemultiple' ? $('#main-form') : $(this).closest('form');
  let id = $(this).attr('data-id');

  form.prepend(`<input class="hidden-submit-input" type="hidden" name="${action}" value="true">`);
  if (id) form.prepend(`<input class="hidden-submit-input" type="hidden" name="id" value="${id}">`);

  $('#modal-submit').off();
  $('#modal-submit').removeClass();
  $('#modal-submit').addClass(`btn btn-${bsClass}`);
  $('#modal-confirm').html(confirm);

  $('#modal-submit').click(function() {

    form.submit();

  });

});

$('#items-per-page').change(function() {

  let string = '';
  let symbol = '?';

  // hacky method of keeping quote type

  if (location.href.includes('type=improve')) {

    string = `?type=improve`;
    symbol = '&';

  } else if (location.href.includes('type=decrease')) {

    string += '?type=improve';
    symbol = '&';

  }

  location.href = `${string}${symbol}items=${$(this).val()}`;

});

$('#modal').on('shown.bs.modal', function() {

  $('#modal-submit').focus();

});

$('#modal').on('hide.bs.modal', function() {

  $('.hidden-submit-input').remove();

});

new Clipboard('#export-code-button');

$('#export-button').click(function() {

  $('#export-code-button').addClass('d-none');
  $('#export-status').removeClass('d-none');

  $.ajax({
    data: {
      table: $(this).data('type'),
      items: [$(this).data('id')]
    },
    method: 'POST',
    url: '../export.php',
    success: function(response) {
      $('#export-status').addClass('d-none');
      $('#export-code-button').attr('data-clipboard-text', response);
      $('#export-code-button').removeClass('d-none');
    }
  });

});

$('#export-selected-button').click(function() {

  $('#export-code-button').addClass('d-none');
  $('#export-status').removeClass('d-none');

  let values = [];

  $('.select-checkbox:checked').each(function() {
    values.push($(this).val());
  });

  $.ajax({
    data: {
      table: $(this).data('type'),
      items: values
    },
    method: 'POST',
    url: '../export.php',
    success: function(response) {
      $('#export-status').addClass('d-none');
      $('#export-code-button').attr('data-clipboard-text', response);
      $('#export-code-button').removeClass('d-none');
    }
  });

});

$('#export-code-button').click(function() {

  notify('Copied to Clipboard');

});

$('#import-button').click(function() {

  $('#import-field, #submit-import').toggleClass('d-none');
  $('#import-response').empty();

});

$('#import-field').keydown(function(e) {

  if (e.keyCode === 13) {

    $('#submit-import').click();
    return false;

  }

});

$('#submit-import').click(function() {

  if ($('#import-field').val()) {

    $('.fa-spinner').removeClass('d-none');

    $.ajax({
      data: {
        table: $(this).data('table'),
        type: $(this).data('type'),
        values: $('#import-field').val()
      },
      method: 'POST',
      url: '../import.php',
      success: function(response) {
        try {
          response = JSON.parse(response);
          if (response.status === 'success') {
            if (response.url == 'none') {
              window.location.reload();
            } else {
              window.location.href = response.url;
            }
          } else {
            $('#import-response').html(`&nbsp;${response.status}`);
            $('.fa-spinner').addClass('d-none');
          }
        } catch (error) {
          $('#import-response').html(`&nbsp;${response}`);
          $('.fa-spinner').addClass('d-none');
        }
      }
    });

  }

});

$('table[data-type="setting"] tbody').sortable({
  axis: 'y',
  update: function() {
    $('tr').removeClass('odd');
    $('tbody').parents('.table-responsive').find('tr:odd').addClass('odd');
    let array = [];
    $('table[data-type="setting"] tbody tr').each(function(index) {
      $(this).attr('data-position', index);
      array.push({
        id: $(this).attr('data-id'),
        position: $(this).attr('data-position')
      });
    });
    $.ajax({
      data: {
        values: array,
        positions: true,
        table: 'settings',
        no_message: true
      },
      method: 'POST',
      url: '../modify.php'
    });
  }
});

function notify(text) {

  let id = Date.now();

  $('#toast-container').append(`<div id="${id}" class="toast show">${text}</div>`);

  setTimeout(() => {

    $(`#${id}`).remove();

  }, 1000);

}
