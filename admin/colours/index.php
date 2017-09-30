<?php

  include("../../sql.php");
  $table = "colours";
  $sql = "SELECT * FROM yourmood.{$table}";
  $result = $conn->query($sql);
  $type = $title = "colour";
  $customHeadings = "<th>Preview</th>";
  $customFields = "../assets/php/colour_preview.php";
  include("../assets/php/page.php");
