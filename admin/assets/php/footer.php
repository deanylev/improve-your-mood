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
  </script>
</body>

</html>
