<?php

  include("../../sql.php");
  $sql = "SELECT * FROM yourmood.colours";
  $result = $conn->query($sql);
  $title = "colour";
  include("../assets/page_content.php");
