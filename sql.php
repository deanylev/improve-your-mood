<?php

$servername = "localhost";
$username = "root";
if ($_SERVER["HTTP_HOST"] == "localhost") {
    $password = "";
} else {
    $password = "De6KAY9YZ8TJutWt";
}
$conn = mysqli_connect($servername, $username, $password);
