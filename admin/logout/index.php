<?php

  session_start();
  unset($_SESSION["user"]);
  $_SESSION["message"]["success"] = "Logged out successfully.";
  header("location: ../login");
