<?php

  if (isset($_GET["type"])) {
    $table = $type = $_GET["type"];
  } else {
    session_start();
    $_SESSION["message"]["danger"] = "An error occured. (005)";
    header("location: ../home");
    die();
  }
  $title = "quote";
  include("../assets/php/page.php");
