<?php

  include("../../sql.php");
  $sql = "SELECT * FROM yourmood.improve";
  $result = $conn->query($sql);
  $title = "quote";
  $version = "improve";
  include("../assets/page_content.php");
