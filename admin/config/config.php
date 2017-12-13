<?php

  include("../../assets/php/sql.php");
  include("../assets/php/user.php");

  if ($currentUser["is_owner"]) {
    $config = $_POST["config"];
    $file = fopen("../../assets/php/settings.ini", "w");
    fwrite($file, $config);
    fclose($file);
  }

  header("location: .");
