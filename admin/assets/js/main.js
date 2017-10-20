$('form').submit(function() {

  return confirm('Are you sure?');

});

$('#password').on('keypress keydown keyup change', function() {

  $('#password_confirmation').attr('disabled', !$(this).val());

  if (!$(this).val()) $('#password_confirmation').val('');

});

if (!$('.action-button').length) $('.actions').remove();

let originalResults = parseInt($('#results-number').text());

$('#search-bar').val('');

$('#search-bar, select').on('keypress keydown keyup change', function() {

  $('.filler').remove();
  $('.preview').addClass('d-none');

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

            preview.mark(search);

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

  } else {

    $('.item').removeClass('d-none');
    $('#results-number').text(originalResults);

  }

});
