<?php

  session_start();

  include("../assets/php/sql.php");
  include("assets/php/user.php");

  $user = $mysqli->query("SELECT * FROM yourmood.users WHERE id = '{$_GET["id"]}'");

  if ($user->num_rows) {
    $user = $user->fetch_object();
    if ($user->is_admin) {
      $_SESSION["message"]["danger"] = "Unauthorised.";
    } else {
      setcookie("user", "", time() - 3600, "/");
      $_SESSION["user"] = $user->id;
    }
  } else {
    $_SESSION["message"]["danger"] = "User doesn't exist.";
  }

  header("location: home");
