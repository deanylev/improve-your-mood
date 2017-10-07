<?php

  $settings = parse_ini_file("settings.ini", true);
  $host = $settings["MYSQL"]["host"];
  $username = $settings["MYSQL"]["username"];
  $password = $settings["MYSQL"]["password"];
  $mysqli = new mysqli($host, $username, $password, "yourmood");
