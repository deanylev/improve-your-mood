<?php

  include("../../sql.php");
  $type = $_GET["type"];
  $table = $type;
  $sql = "SELECT * FROM yourmood.${table}";
  $result = $conn->query($sql);
  $title = "quote";
  include("../assets/php/page.php");
