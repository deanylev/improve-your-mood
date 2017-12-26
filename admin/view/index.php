<?php

  session_start();

  $type = $_GET["type"];
  $id = $_GET["id"];
  $title = $_GET["title"];
  $singular = true;
  $action = "view";
  $otherTitle = ucwords($action) . " " . ucwords($title);
  if ($id == $_SESSION["user"] && $type === "users") {
    $userPage = "view";
  }
  include("../../assets/php/sql.php");
  $result = $mysqli->query("SELECT * FROM yourmood.{$type} WHERE id='{$id}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
      include("../assets/php/header.php");
  } else {
      $_SESSION["message"]["danger"] = "An error occured. (006)";
      header("location: ../{$title}s?type={$type}");
  }

  while ($column = $result->fetch_field()) {
      $columnTypes[$column->name] = $column->type;
  }

?>

<h1 class="text-center">View <?php echo $title === "user" && $id == $_SESSION["user"] ? "Your Profile" : ucwords($title); ?></h1>
<br>

<form class="form-group text-center container" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $type; ?>">
  <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">

<?php

  foreach ($row as $key => $val) {
    if ($key !== "id" && $key !== "password" && $key !== "is_owner") {
      $columnType = $columnTypes[$key];
      if ($key === "created_by") {
        if ($mysqli->query("SELECT * FROM yourmood.users WHERE id = {$val}")->num_rows):
          $user = $mysqli->query("SELECT * FROM yourmood.users WHERE id = '{$val}'")->fetch_object();

?>

          <p><b><?php echo $key; ?>:</b><br><a href="../view/?type=users&title=user&id=<?php echo $user->id; ?>"><?php echo $user->user; ?></a></p><br>

<?php else: ?>

          <p><b><?php echo $key; ?>:</b><br>unknown</p><br>

<?php
        endif;
      } elseif ($key === "created_at" && $val === "0000-00-00 00:00:00") {
?>

          <p><b><?php echo $key; ?>:</b><br>unknown</p><br>

<?php
      } elseif ($key === "image") {

?>

          <p><b><?php echo $key; ?>:</b></p>
          <img class="user-image" src="../users/image.php?id=<?php echo $id; ?>">
          <br><br>

<?php
      } elseif ($columnType === 1)  {

?>

          <p><b><?php echo $key; ?>:</b><br><?php echo $val === "1" ? "true" : "false"; ?></p><br>

<?php
      } else {

?>

          <p><b><?php echo $key; ?>:</b><br><?php echo $val; ?></p><br>

<?php if ($title === "colour" && $key === "colour"): ?>

          <p><b>preview:</b><br><div class="colour-preview" style="background-color: #<?php echo $val; ?>; margin: 0 auto;"></div></p><br>

<?php

        endif;

      }
    }
  }

  if (in_array("edit", $actions)):

?>

  <a class="btn btn-lg btn-warning" href="../edit?type=<?php echo $type; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Edit</a>

<?php

  endif;

  if (in_array("clone", $actions)):

?>

  <button class="btn btn-lg btn-info submit" type="button" data-action="clone" data-undo="true" data-confirm="cloning a <?php echo $title; ?>" data-class="info" data-toggle="modal" data-target="#modal">Clone</button>

<?php

  endif;

  if (in_array("delete", $actions)):

?>

  <button class="btn btn-lg btn-danger submit" type="button" data-action="delete" data-confirm="deleting a <?php echo $title; ?>" data-class="danger" data-toggle="modal" data-target="#modal">Delete</button>

<?php

  endif;

  if (isset($userPage)):

?>

  <a class="btn btn-lg btn-success" href="../logout">Log Out</a>

<?php

  endif;

  if ($currentUser["is_admin"] && in_array("create", $actions)):

?>

  <button id="export-button" class="btn btn-lg btn-dark" type="button" data-type="<?php echo $type; ?>" data-id="<?php echo $id; ?>">Export</button>

  <br><br>

  <p id="export-status" class="d-none">Loading...</p>

  <button id="export-code-button" class="btn btn-dark d-none" type="button">Copy Export Code</button>

<?php endif; ?>

</form>

<?php include("../assets/php/footer.html"); ?>
