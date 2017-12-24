<?php

  include(dirname(__FILE__) . "../../../../assets/php/cookies.php");

  session_start();

  if (isset($_COOKIE["user"])) {
    $_SESSION["user"] = decryptCookie($_COOKIE["user"]);
  }

  if (isset($_SESSION["user"])) {
      header("location: ../home");
  }
