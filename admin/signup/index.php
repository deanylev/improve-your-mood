<?php include("../assets/php/force_unauth.php"); ?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Admin Panel - Sign Up</title>
  <link rel="stylesheet" href="../assets/css/vendor/bootstrap.min.css?v=4.0.0">
  <link rel="stylesheet" href="../assets/css/vendor/font-awesome.min.css?v=4.7.0">
  <link rel="stylesheet" href="../assets/css/main.css">
  <script src="../../assets/js/vendor/jquery.min.js?v=3.2.1"></script>
  <script src="../assets/js/vendor/bootstrap.min.js?v=4.0.0"></script>
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
      <h1 class="text-center">Sign Up</h1>
      <form class="signup" action="signup.php" method="POST">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" name="username" class="form-control" id="user">
          <p class="validation-errors text-danger" data-field="username"></p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input data-required="true" type="password" name="password" class="form-control" id="password">
          <p class="validation-errors text-danger" data-field="password"></p>
        </div>
        <div class="form-group">
          <label for="password_confirmation">Password Confirmation</label>
          <input type="password" name="password_confirmation" class="form-control" id="password_confirmation">
          <p class="validation-errors text-danger" data-field="password_confirmation"></p>
        </div>
        <?php if (isset($settings["CONFIG"]["admin_signup"]) && $settings["CONFIG"]["admin_signup"] === "1" && isset($settings["KEYS"]["admin"]) && $settings["KEYS"]["admin"]): ?>
          <div class="form-group">
            <label for="admin_key">Admin Key (optional)</label>
            <input type="password" name="admin_key" class="form-control" id="admin_key">
            <p class="validation-errors text-danger" data-field="admin_key"></p>
          </div>
        <?php endif; ?>
        <p class="response text-danger"></p>
        <button id="save-button" class="btn btn-primary" type="submit">Sign Up<i class="d-none fa fa-spinner fa-pulse fa-fw"></i></button>
        <a class="btn btn-link" href="../login">Log In</a>
      </form>
    </div>
  </div>
  <script src="signup.js"></script>
</body>

</html>
