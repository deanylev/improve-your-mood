<?php

  include("../../sql.php");
  $table = "colours";
  $sql = "SELECT * FROM yourmood.{$table}";
  $result = $conn->query($sql);
  $title = "colour";
  include("../assets/php/page.php");
