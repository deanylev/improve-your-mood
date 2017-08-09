<?php

  include("../../sql.php");
  $sql = "SELECT * FROM yourmood.decrease";
  $result = $conn->query($sql);
  $title = "quote";
  $version = "decrease";
  include("../assets/page_content.php");
