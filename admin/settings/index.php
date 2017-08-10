<?php

  include("../../sql.php");
  $sql = "SELECT * FROM yourmood.settings";
  $result = $conn->query($sql);
  $title = "setting";
  include("../assets/page_content.php");
