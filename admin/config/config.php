<?php

  include("../../assets/php/sql.php");
  include("../assets/php/user.php");

  if ($currentUser["is_owner"]) {
    $config = $_POST["config"];
    $file = fopen("../../assets/php/settings.ini", "w");
    fwrite($file, $config);
    fclose($file);
    $_SESSION["message"]["success"] = "Successfully updated config.";
  }

  header("location: .");
