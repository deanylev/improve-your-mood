<?php

  include("../../sql.php");
  $version = $_GET["version"];
  $table = $version;
  $sql = "SELECT * FROM yourmood.${table}";
  $result = $conn->query($sql);
  $title = "quote";
  include("../assets/php/page.php");
