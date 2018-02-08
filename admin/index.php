<?php

  include("../assets/php/settings.php");

  if (!file_exists("../assets/php/settings.ini")) {
    $file = @fopen("../assets/php/settings.ini", "w");
    $cookieKey = md5(uniqid());
    $adminKey = md5(uniqid());
    if (!$file) {
      die("Writing failed, please manually create the file <b>settings.ini</b> in <b>/assets/php/</b> in this format:<br><br>
      <b>
        [MYSQL]<br>
        host = YourHost<br>
        username = YourUsername<br>
        password = YourPassword<br>
        [KEYS]<br>
        cookie = {$cookieKey}<br>
        admin = {$adminKey}<br>
        [CONFIG]<br>
        admin_signup = false
      </b>");
    } else {
      $text = "[MYSQL]\nhost = YourHost\nusername = YourUsername\npassword = YourPassword\n[KEYS]\ncookie = {$cookieKey}\nadmin = {$adminKey}\n[CONFIG]\nadmin_signup = false";
      fwrite($file, $text);
      fclose($file);
      header("location: home");
    }
  } elseif (!isset($settings["MYSQL"]) || !isset($settings["KEYS"])) {
    die("The values in your settings.ini are not valid. They must be in this format:<br><br>
    <b>
      [MYSQL]<br>
      host = YourHost<br>
      username = YourUsername<br>
      password = YourPassword<br>
      [KEYS]<br>
      cookie = {$cookieKey}<br>
      admin = {$adminKey}<br>
      [CONFIG]<br>
      admin_signup = false
    </b>");
  } else {
    header("location: home");
  }
