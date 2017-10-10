<?php

  @session_start();

  include("../../assets/php/sql.php");
  include("actions.php");
  include("force_auth.php");

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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/css/bootstrap.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.5/umd/popper.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>
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
    .btn {
      cursor: pointer;
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a href="../home" class="navbar-brand">MoodBackend</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="main-nav">
      <ul class="nav navbar-nav">
        <li class="nav-item <?php echo $title === "user" ? "active" : "" ?>">
          <a class="nav-link" href="../users">Users</a>
        </li>
        <li class="nav-item <?php echo isset($type) && $type === "improve" ? "active" : "" ?>">
          <a class="nav-link" href="../quotes?type=improve">Improve Quotes</a>
        </li>
        <li class="nav-item <?php echo isset($type) && $type === "decrease" ? "active" : "" ?>">
          <a class="nav-link" href="../quotes?type=decrease">Decrease Quotes</a>
        </li>
        <li class="nav-item <?php echo $title === "colour" ? "active" : "" ?>">
          <a class="nav-link" href="../colours">Colours</a>
        </li>
        <li class="nav-item <?php echo $title === "setting" ? "active" : "" ?>">
          <a class="nav-link" href="../settings">Settings</a>
        </li>
        <li class="nav-item <?php echo $title === "log" ? "active" : "" ?>">
          <a class="nav-link" href="../logs">Logs</a>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <div class="btn-group">
            <a class="btn btn-primary <?php echo isset($userPage) ? "active" : "" ?>" href="../<?php echo $currentUser["read_only"] ? "view" : "edit"; ?>/?type=users&amp;title=user&amp;id=<?php echo $_SESSION["user"]; ?>"><?php echo $currentUser["name"]; ?></a>
            <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item" href="../logout">Log Out</a>
            </div>
          </div>
        </li>
      </ul>
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
  <br>
