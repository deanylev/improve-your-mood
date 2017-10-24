<?php

  session_start();

  if (isset($_SESSION["user"])) {
      header("location: ../home");
  }

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Admin Panel - Log In</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="../assets/css/main.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>
</head>
<body class="container bg-primary">
  <br>
  <?php

    if (isset($_SESSION["message"])) {
        foreach ($_SESSION["message"] as $key => $val): ?>

    <div class="alert alert-<?php echo $key; ?>">
      <?php echo $val; ?>
      <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    </div>

  <?php

    unset($_SESSION["message"]);
        endforeach;
    }

  ?>
  <div class="card">
    <div class="card-body">
      <h1 class="text-center">Log In</h1>
      <form action="authenticate.php" method="POST">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" name="user" class="form-control" id="username">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" class="form-control" id="password">
        </div>
        <p class="text-danger"></p>
        <button type="submit" class="btn btn-primary">Log In<i class="d-none fa fa-spinner fa-pulse fa-fw"></i></button>
        <a class="btn btn-link" href="../reset">I Can't Log In</a>
      </form>
    </div>
  </div>
  <script>
  $('form').submit(function() {

    $('.fa-spinner').removeClass('d-none');

    $.ajax({
      data: $('form').serialize(),
      method: 'POST',
      url: 'authenticate.php',
      success: function(response) {
        if (response === 'success') {

          window.location.href = '../home'

        } else {

          $('.text-danger').text('Invalid credentials.');
          $('.fa-spinner').addClass('d-none');

        }
      }
    });

    return false;

  });
  </script>
</body>

</html>
