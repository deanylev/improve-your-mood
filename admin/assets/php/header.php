<?php

  session_start();

  if (!isset($_SESSION["user"])) {
      header("location: ../login");
      die();
  }

  include("actions.php");
  include("../../assets/php/sql.php");

  $titles = array("user", "home", "quote", "colour", "setting", "log");

  $titlePairs = array("users" => "user", "improve"=>"quote", "decrease"=>"quote", "colours"=>"colour", "settings"=>"setting", "logs"=>"log");

  if (!in_array($title, $titles) || (isset($type) && array_key_exists($type, $titlePairs) && $titlePairs[$type] !== $title)) {
      $_SESSION["message"]["danger"] = "An error occured";
      header("location: ../home");
      die();
  }

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Admin Panel - <?php echo ucwords($title); echo isset($singular) ? "" : "s"; ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <style>
    html {
      position: relative;
      min-height: 100%;
    }
    body {
      margin-bottom: 60px;
    }
    footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60px;
      text-align: center;
    }
    .colour-preview {
      width: 20px;
      height: 20px;
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="../home" class="navbar-brand">MoodBackend</a>
      </div>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="nav navbar-nav">
          <li class="<?php echo $title === "user" ? "active" : "" ?>"><a href="../users">Users</a></li>
          <li class="<?php echo isset($type) && $type === "improve" ? "active" : "" ?>"><a href="../quotes?type=improve">Improve Quotes</a></li>
          <li class="<?php echo isset($type) && $type === "decrease" ? "active" : "" ?>"><a href="../quotes?type=decrease">Decrease Quotes</a></li>
          <li class="<?php echo $title === "colour" ? "active" : "" ?>"><a href="../colours">Colours</a></li>
          <li class="<?php echo $title === "setting" ? "active" : "" ?>"><a href="../settings">Settings</a></li>
          <li class="<?php echo $title === "log" ? "active" : "" ?>"><a href="../logs">Logs</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a href="../view/?type=users&amp;title=user&amp;id=<?php echo $_SESSION["user_id"]; ?>"><?php echo $_SESSION["user"]; ?></a></li>
          <li><a href="../logout">Log Out</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
    <?php

      if (isset($_SESSION["message"])) {
          foreach ($_SESSION["message"] as $key => $val): ?>

      <br>
      <div class="alert alert-<?php echo $key; ?>">
        <?php echo $val; ?>
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
      </div>

    <?php

      unset($_SESSION["message"]);
    endforeach;
      }

    ?>
  </div>
