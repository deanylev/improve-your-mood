<?php

$settings = parse_ini_file("settings.ini", true);
$servername = $settings["MYSQL"]["host"];
$username = $settings["MYSQL"]["username"];
$password = $settings["MYSQL"]["password"];
$conn = mysqli_connect($servername, $username, $password);
