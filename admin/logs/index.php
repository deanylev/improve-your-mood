<?php

  include("../../sql.php");
  $table = "logs";
  $sql = "SELECT * FROM yourmood.{$table}";
  $result = $conn->query($sql);
  $type = $title = "log";
  $notDefault = true;
  $customHeadings = "<th>Sent At</th><th>IP Address</th><th>Version</th><th>Platform</th>";
  $customFields = "../assets/php/log_columns.php";
  include("../assets/php/page.php");
