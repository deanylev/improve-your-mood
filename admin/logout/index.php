<?php

  session_start();
  unset($_SESSION["user"]);
  setcookie("user", "", time() - 3600, "/");
  $_SESSION["message"]["success"] = "Logged out successfully.";
  header("location: ../login");
