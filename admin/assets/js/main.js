$('form').submit(function() {

  if ($(this).hasClass('errors')) {

    return false;

  }

});

if (!$('.action-button').length) $('.actions').remove();

var lastChecked = null;
var checkBoxes = $('.item:not(.d-none) .select-checkbox');

checkBoxes.click(function(e) {

  if (!lastChecked) {

    lastChecked = this;
    return;

  }

  if (e.shiftKey) {

    var start = checkBoxes.index(this);
    var end = checkBoxes.index(lastChecked);

    checkBoxes.slice(Math.min(start, end), Math.max(start, end) + 1).prop('checked', lastChecked.checked);

  }

  lastChecked = this;

});

checkBoxes.change(function() {

  $('#select-multiple-input').remove();
  $('#delete-selected-button').addClass('d-none');

  if ($('.select-checkbox:checked').length) {

    $('#delete-selected-button').removeClass('d-none');
    $('#select-multiple-form').append('<input id="select-multiple-input" type="hidden" name="deletemultiple" value="true">');

  }

});

let originalResults = parseInt($('#results-number').text());

function search() {

  $('.filler').remove();
  $('.preview').addClass('d-none');
  $('.no-results').remove();

  let field = $('select[name="field"]').val();
  let query = $('select[name="query"]').val();
  let search = $('#search-bar').val().toLowerCase();
  let results = 0;

  if (search) {

    $('.item').addClass('d-none');

    if (search === 'null' && query === 'equals') {

      search = null;
      $('#search-bar').addClass('text-danger');

    } else {

      $('#search-bar').removeClass('text-danger');

    }

    $('.item').each(function() {

      let itemFieldFull = $(this).attr(`data-${field}`)
      let itemField = itemFieldFull.toLowerCase();

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
              separateWordSearch: false
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

$('#search-bar, select').on('keypress keydown keyup change', search);

$('.submit').click(function() {

  let action = $(this).attr('data-action');
  let form = action === 'deleteselected' ? $('#select-multiple-form') : $(this).closest('form');

  form.prepend(`<input class="hidden-submit-input" type="hidden" name="${action}" value="true">`);

  $('#modal-submit').off();

  $('#modal-submit').click(function() {

    form.submit();

  });

});

$('#modal').on('shown.bs.modal', function() {

  $('#modal-submit').focus();

});

$('#modal').on('hide.bs.modal', function() {

  $('.hidden-submit-input').remove();

});
