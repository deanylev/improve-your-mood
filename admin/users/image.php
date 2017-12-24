<?php

  $allowNormal = true;
  header('Content-Type: image/png');
  include("../../assets/php/sql.php");
  @include("../assets/php/user.php");

  $id = @$_GET["id"];
  $query = @$mysqli->query("SELECT * FROM yourmood.users WHERE id = '{$id}'");
  $file = @$query->fetch_object()->image;

  if (isset($_GET["id"]) && $query->num_rows && $file && file_exists("../uploads/images/user/{$file}")) {
    $path = "../uploads/images/user/{$file}";
  } else {
    $path = "../uploads/images/user/placeholder.png";
  }

  $imageFile = imagecreatefrompng($path);

  list($width, $height) = getimagesize($path);
  $newWidth = $newHeight = isset($_GET["s"]) ? $_GET["s"] : 80;
  $image = imagecreatetruecolor($newHeight, $newWidth);

  imagecolortransparent($image, imagecolorallocatealpha($image, 0, 0, 0, 127));
  imagealphablending($image, false);
  imagesavealpha($image, true);
  imagecopyresampled($image, $imageFile, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
  imagepng($image, null, 0);
  imagedestroy($image);
