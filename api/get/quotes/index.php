<?php

  if (isset($_GET["version"])) {
    $table = $_GET["version"];
    $field = "quote";
    include("../../../assets/php/array_serializer.php");
  } else {
    echo "Quote version not specified.";
  }
