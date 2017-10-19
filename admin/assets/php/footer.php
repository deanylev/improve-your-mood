  <br>
  <footer>
    <div class="container">
      <p class="text-muted">MoodBackend v2.0 | &copy; 2017 <a href="https://deanlevinson.com.au">Dean Levinson</a></p>
    </div>
  </footer>
  <script>
    $('form').submit(function() {

      return confirm('Are you sure?');

    });

    $('#password').on('keypress keydown keyup change', function() {

      $('#password_confirmation').attr('disabled', !$(this).val());

      if (!$(this).val()) $('#password_confirmation').val('');

    });

    if (!$('.action-button').length) $('.actions').remove();

    let originalResults = parseInt($('#results-number').text());

    $('#search-bar, select[name="field"]').on('keypress keydown keyup change', function() {

      $('.filler').remove();

      let field = $('select[name="field"]').val();
      let search = $('#search-bar').val().toLowerCase();
      let results = 0;

      if (search) {

        $('.item').addClass('d-none');

        if (search === 'null') {

          search = null;
          $('#search-bar').addClass('text-danger');

        } else {

          $('#search-bar').removeClass('text-danger');

        }

        $('.item').each(function() {

          if ((search && $(this).attr(`data-${field}`).toLowerCase().includes(search)) || (search === null && $(this).attr(`data-${field}`) === '')) {

            $(this).removeClass('d-none');
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
  </script>
</body>

</html>
