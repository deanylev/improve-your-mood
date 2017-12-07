<?php

  session_start();

  $type = $_GET["type"];
  $id = $_GET["id"];
  $title = $_GET["title"];
  $singular = true;
  $action = "edit";
  $otherTitle = ucwords($action) . " " . ucwords($title);
  if ($id == $_SESSION["user"] && $type === "users") {
      $userPage = "edit";
  }
  include("../../assets/php/sql.php");
  $result = $mysqli->query("SELECT * FROM yourmood.{$type} WHERE id='{$id}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
      $fieldInfo = mysqli_fetch_field($result);
      include("../assets/php/header.php");
  } else {
      $_SESSION["message"]["danger"] = "An error occured. (002)";
      header("location: ../{$title}s?type={$type}");
  }

  while ($column = $result->fetch_field()) {
      $columnTypes[$column->name] = $column->type;
  }

?>

<h1 class="text-center">Edit <?php echo isset($userPage) ? "Your Profile" : ucwords($title); ?></h1>
<br>

<form id="main-edit-form" class="form-group text-center container" action="../modify.php" method="POST" enctype="multipart/form-data">
  <input type="hidden" name="table" value="<?php echo $type; ?>">
  <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">

<?php

  foreach ($row as $key => $val) {
      if ($key !== "id" && $key !== "created_at" && $key !== "created_by" && $key !== "password" && $key !== "image" && (($key !== "app_settings" && $key !== "items_per_page") || $currentUser["is_admin"]) && (($key !== "read_only" && $key !== "is_admin") || $id != $_SESSION["user"])) {
        $columnType = $columnTypes[$key];
        $blockDiv = true;

?>

<div data-field="<?php echo $key; ?>">

<?php

          switch ($columnType):
            case 252:

?>

            <div class="form-group">
              <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
              <textarea id="<?php echo $key; ?>" class="form-control" data-field-key="<?php echo $key; ?>" name="values[<?php echo $key; ?>]"><?php echo $val; ?></textarea>
            </div>

<?php
            break;

            case 1:

?>

            <div class="form-check">
              <label class="form-check-label">
                <input type="hidden" name="values[<?php echo $key; ?>]" value="0">
                <input type="checkbox" class="form-check-input" <?php echo $val ? "checked" : ""; ?> name="values[<?php echo $key; ?>]" value="1">
                <?php echo $key; ?>
              </label>
            </div>

<?php
            break;

            case 253:

?>

            <div class="form-group">
              <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
              <input type="text" class="form-control" id="<?php echo $key; ?>" value="<?php echo $val; ?>" name="values[<?php echo $key; ?>]">
            </div>

<?php
            break;

            case 3:

?>

            <div class="form-group">
              <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
              <input type="number" class="form-control" id="<?php echo $key; ?>" value="<?php echo $val; ?>" name="values[<?php echo $key; ?>]">
            </div>

<?php

            break;

            default:
              $blockDiv = false;

?>

            <input type="hidden" value="<?php echo $val; ?>" name="values[<?php echo $key; ?>]">

<?php

            break;

          endswitch;

          if ($blockDiv):

?>

<div class="validation-errors text-danger"></div>
<br>
<?php endif; ?>
</div>

<?php

      }
  }

  if ($type === "users"):

?>

    <div data-field="image">
      <label>image<br>(square, png, < 2MB)</label>
      <div id="image"></div>
      <div class="validation-errors text-danger"></div>
      <input type="hidden" value="<?php echo $row["image"]; ?>" id="image_name" name="values[image]">
    </div>
    <?php if ($row["image"]): ?>
      <div id="image-preview">
        <img class="user-image" src="../users/image.php?id=<?php echo $id; ?>">
        <br><br>
        <button id="remove-image" class="btn btn-dark">Remove</button>
        <br>
      </div>
    <?php endif; ?>
    <br>
    <div data-field="password">
      <div class="form-group">
        <label for="password">password <span id="password_strength"></span></label>
        <input type="password" id="password" class="form-control" name="values[password]" placeholder="Unchanged" autocomplete="new-password"></input>
      </div>
      <div class="validation-errors text-danger"></div>
      <br>
    </div>
    <div data-field="password_confirmation">
      <div class="form-group">
        <label for="password_confirmation">password confirmation</label>
        <input type="password" id="password_confirmation" class="form-control" name="password_confirmation" disabled></input>
      </div>
      <div class="validation-errors text-danger"></div>
      <br>
    </div>

<?php

    endif;

?>

  <p class="text-danger response"></p>

  <button id="save-button" class="btn btn-lg btn-success submit" type="button" data-action="edit" data-confirm="<?php echo isset($userPage) ? "saving your edited profile" : "saving an edited {$title}"; ?>" data-class="success" data-toggle="modal" data-target="#modal">Save</button>
  <?php if (in_array("view", $actions)): ?>
    <a class="btn btn-lg btn-primary" href="../view?type=<?php echo $type; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Cancel</a>
  <?php elseif ($currentUser["is_admin"]): ?>
    <a class="btn btn-lg btn-primary" href="../<?php echo $title; ?>s?type=<?php echo $type; ?>">Cancel</a>
  <?php endif; ?>
  <?php if (in_array("clone", $actions)): ?>
    <button class="btn btn-lg btn-info submit" type="button" data-action="clone" data-undo="true" data-confirm="cloning a <?php echo $title; ?>" data-class="info" data-toggle="modal" data-target="#modal">Clone</button>
  <?php endif; ?>
  <?php if (in_array("delete", $actions)): ?>
    <button class="btn btn-lg btn-danger submit" type="button" data-action="delete" data-confirm="deleting a <?php echo $title; ?>" data-class="danger" data-toggle="modal" data-target="#modal">Delete</button>
  <?php endif; ?>
</form>

<script>let itemId = <?php echo $id; ?></script>
<script src="edit.js"></script>

<?php include("../assets/php/footer.html"); ?>
