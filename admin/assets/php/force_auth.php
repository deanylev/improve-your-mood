<?php

  include("../../assets/php/cookies.php");

  if (isset($_COOKIE["user"])) {
    $_SESSION["user"] = decryptCookie($_COOKIE["user"]);
  }

  if (!isset($_SESSION["user"])) {
      header("location: ../login");
      die();
  }
