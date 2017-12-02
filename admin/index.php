<?php

  include("../assets/php/settings.php");

  if (!file_exists("../assets/php/settings.ini")) {
    $file = @fopen("../assets/php/settings.ini", "w");
    if (!$file) {
      die("Writing failed, please manually create the file <b>settings.ini</b> in <b>/assets/php/</b> in this format:<br><br>
      <b>
        [MYSQL]<br>
        host = YourHost<br>
        username = YourUsername<br>
        password = YourPassword<br>
        [KEYS]<br>
        cookie = LongRandomValue (eg. ejr890e9ah8453h89rnudfn)
      </b>");
    } else {
      $cookieKey = md5(uniqid());
      $text = "[MYSQL]\nhost = YourHost\nusername = YourUsername\npassword = YourPassword\n[KEYS]\ncookie = {$cookieKey}";
      fwrite($file, $text);
      fclose($file);
    }
  } elseif (!isset($settings["MYSQL"]) || !isset($settings["KEYS"])) {
    die("The values in your settings.ini are not valid. They must be in this format:<br><br>
    <b>
      [MYSQL]<br>
      host = YourHost<br>
      username = YourUsername<br>
      password = YourPassword<br>
      [KEYS]<br>
      cookie = LongRandomValue (eg. ejr890e9ah8453h89rnudfn)
    </b>");
  } else {
    header("location: home");
  }
