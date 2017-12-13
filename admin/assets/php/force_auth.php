<?php

  include(dirname(__FILE__) . "../../../../assets/php/cookies.php");
  include(dirname(__FILE__) . "../../../../assets/php/sql.php");

  if (isset($_COOKIE["user"])) {
    $cookie = $_COOKIE["user"];
  }

  if (isset($cookie) && $mysqli->query("SELECT * FROM yourmood.sessions WHERE user = '$cookie' AND valid = 1")->num_rows) {
    $user = $_SESSION["user"] = decryptCookie($_COOKIE["user"]);
    $dateNow = date("Y-m-d H:i:s");
    $mysqli->query("INSERT INTO yourmood.sessions (user, created_at) VALUES ('$user', '$dateNow')");
    $_SESSION["id"] = $mysqli->insert_id;
  }

  if (isset($_SESSION["id"])) {
    $session = $_SESSION["id"];
  }

  if (!(isset($_SESSION["user"]) && $mysqli->query("SELECT * FROM yourmood.sessions WHERE id = '$session' AND valid = 1")->num_rows)) {
    header("location: ../login");
    die();
  }
