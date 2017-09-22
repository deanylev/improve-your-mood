<?php

  include("../../sql.php");
  $table = "settings";
  $sql = "SELECT * FROM yourmood.{$table}";
  $result = $conn->query($sql);
  $title = "setting";
  include("../assets/php/page.php");
