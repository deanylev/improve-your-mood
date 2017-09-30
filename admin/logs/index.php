<?php

  include("../../sql.php");
  $table = "logs";
  $type = $title = "log";
  $notDefault = true;
  $customHeadings = "<th>Sent At</th><th>IP Address</th><th>Version</th><th>Platform</th>";
  $customFields = "../assets/php/log_columns.php";
  include("../assets/php/page.php");
