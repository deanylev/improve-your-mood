<?php

  session_start();
  include("../../assets/php/sql.php");

  $targetDir = "../uploads/images/user/";

  if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $image = $_SESSION["last_image"];
    unlink("../uploads/images/user/{$image}");
    unset($_SESSION["last_image"]);
  } else {
    foreach ($_FILES as $file) {
        $fileType = pathinfo($file["name"], PATHINFO_EXTENSION);
        $file["name"] = md5(uniqid() . $file["name"]) . "." . $fileType;
        $targetFile = $targetDir . $file["name"];
        $imageInfo = getimagesize($file["tmp_name"]);
        $imageWidth = $imageInfo[0];
        $imageHeight = $imageInfo[1];
        $uploadOk = 1;
        // Check if image file is a actual image or fake image
        $check = getimagesize($file["tmp_name"]);
        if ($check !== false) {
            $uploadOk = 1;
        } else {
            $message = (object) array("error" => "Not a valid image.");
            $uploadOk = 0;
        }
        // Check file size
        if ($file["size"] > 2000000) {
            $message = (object) array("error" => "File can't be over 2MB.");
            $uploadOk = 0;
        }
        // Must be square
        if ($imageWidth !== $imageHeight) {
            $message = (object) array("error" => "Image width and height must be the same.");
            $uploadOk = 0;
        }
        // Allow certain file formats
        if ($fileType != "png") {
            $message = (object) array("error" => "Must be a png image.");
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk === 1 && move_uploaded_file($file["tmp_name"], $targetFile)) {
            $message = (object) array("success" => "true", "name" => $file["name"]);
        }
    }

    // Provide a response to Fine Uploader
    echo json_encode($message);

    // Store the image name in case the user wants to delete it
    $_SESSION["last_image"] = $file["name"];

    // Delete unused images
    foreach(scandir("../uploads/images/user") as $image) {
      if ($image !== $file["name"] && $image !== "." && $image !== ".." && $image !== "placeholder.png" && !$mysqli->query("SELECT * FROM yourmood.users WHERE image='{$image}'")->num_rows) {
        unlink("../uploads/images/user/{$image}");
      }
    }
  }
