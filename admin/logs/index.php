<?php

  include("../../sql.php");
  $table = "logs";
  $sql = "SELECT * FROM yourmood.{$table}";
  $result = $conn->query($sql);
  $title = "log";
  include("../assets/php/page.php");
