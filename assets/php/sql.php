<?php

  include("settings.php");
  $host = $settings["MYSQL"]["host"];
  $username = $settings["MYSQL"]["username"];
  $password = $settings["MYSQL"]["password"];
  $mysqli = new mysqli($host, $username, $password, "yourmood");
