<?php

  session_start();

  if (isset($_SESSION["user"])) {
      header("location: ../home");
  }

  $file = @fopen("reset_code.txt", "w");

  if (!$file) {
    $_SESSION["message"]["danger"] = "Failed to create reset_code.txt file. Please enable write permissions (777) on this directory.";
  } else {
    $code = md5(uniqid());
    $_SESSION["reset_code"] = $code;
    fwrite($file, $code);
  }

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Admin Panel - Reset</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/css/bootstrap.min.css">
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
      <h1 class="text-center">Reset Default User</h1>
      <br>
      <p class="text-center">A reset code has been generated and written to a file in this folder called <b>reset_code.txt</b>. Open it and paste in the generated code.<br><br>The default user with credentials <b>admin</b> and <b>password</b> will be created. You should change this password <b>immediately</b> after logging in.</p>
      <br>
      <form action="verify.php" method="POST">
        <div class="form-group">
          <label for="reset_code">Reset Code</label>
          <input type="password" name="reset_code" class="form-control" id="reset_code" placeholder="Enter the generated reset code" <?php echo $file ? "" : "disabled" ?>>
        </div>
        <p class="text-danger"></p>
        <button type="submit" class="btn btn-primary" <?php echo $file ? "" : "disabled" ?>>Submit</button>
        <a class="btn btn-link" href="../login">Cancel</a>
      </form>
    </div>
  </div>
  <script>
    $('form').submit(function() {

      $.ajax({
        data: $('form').serialize(),
        method: 'POST',
        url: 'verify.php',
        success: function(response) {
          response === 'success' ? window.location.href = '../login' : $('.text-danger').text('Reset code incorrect. New one generated.');
        }
      });

      return false;

    });
  </script>
</body>

</html>
