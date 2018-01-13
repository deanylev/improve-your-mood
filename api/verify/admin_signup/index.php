<?php

  include("../../../assets/php/settings.php");

  if (isset($settings["CONFIG"]["admin_signup"]) && $settings["CONFIG"]["admin_signup"] === "1" && isset($settings["KEYS"]["admin"]) && $settings["KEYS"]["admin"]) {
    echo "true";
  } else {
    echo "false";
  }
