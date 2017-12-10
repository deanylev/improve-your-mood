<?php

  include("../../../assets/php/settings.php");

  if (isset($settings["CONFIG"]["admin_signup"]) && $settings["CONFIG"]["admin_signup"] === "1" && isset($settings["CONFIG"]["admin_key"]) && $settings["CONFIG"]["admin_key"]) {
    echo "true";
  } else {
    echo "false";
  }
