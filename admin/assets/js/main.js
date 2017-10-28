$('.pre-loader').addClass('d-none');
$('.show-on-load').removeClass('d-none');

$('form').submit(function() {

  if ($(this).hasClass('errors')) return false;

});

if (!$('.action-button').length) $('.actions').remove();

let lastChecked = null;
let checkBoxes = $('.item:not(.d-none) .select-checkbox');

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
  let button = $('#delete-selected-button');
  let plural = checked === 1 ? '' : 's';
  let number = checked === 1 ? 'a' : checked;

  $('#select-multiple-input').remove();

  button.addClass('d-none');

  if (checked) {

    button.removeClass('d-none');
    $('#select-multiple-form').append('<input id="select-multiple-input" type="hidden" name="deletemultiple" value="true">');
    $('#selected-number').text(checked);

  }

  button.attr('data-confirm', `deleting ${number} ${button.attr('data-title')}${plural}`);

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
    if (!results) $('table').after('<div class="text-center no-results"><br><h3>No Results</h3></div>');

  } else {

    $('.item').removeClass('d-none');
    $('#results-number').text(originalResults);

  }

  checkBoxes = $('.item:not(.d-none) .select-checkbox');

}

if ($('#search-bar').val()) search();
$('#search-bar, select[name], #case-sensitive').on('keypress keydown keyup change', search);

$('.submit').click(function() {

  let action = $(this).attr('data-action');
  let bsClass = $(this).attr('data-class');
  let undo = $(this).attr('data-undo') === 'true' ? 'You will be able to undo this action.' : 'You will not be able to undo this action.';
  let confirm = `You are ${$(this).attr('data-confirm')}. ${undo}`;
  let form = action === 'deletemultiple' ? $('#main-form') : $(this).closest('form');
  let id = $(this).attr('data-id');

  form.prepend(`<input class="hidden-submit-input" type="hidden" name="${action}" value="true">`);
  if (id) form.prepend(`<input class="hidden-submit-input" type="hidden" name="id" value="${id}">`);

  $('#modal-submit').off();
  $('#modal-submit').removeClass();
  $('#modal-submit').addClass(`btn btn-${bsClass}`);
  $('#modal-confirm').text(confirm);

  $('#modal-submit').click(function() {

    form.submit();

  });

});

$('#items-per-page').change(function() {

  let string = `?items=${$(this).val()}`;

  // hacky method of keeping quote type

  if (location.href.includes('type=improve')) {

    string += '&type=improve';

  } else if (location.href.includes('type=decrease')) {

    string += '&type=decrease';

  }

  location.href = string;

});

$('#modal').on('shown.bs.modal', function() {

  $('#modal-submit').focus();

});

$('#modal').on('hide.bs.modal', function() {

  $('.hidden-submit-input').remove();

});
