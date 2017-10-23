<?php

  session_start();

  $type = $_GET["type"];
  $id = $_GET["id"];
  $title = $_GET["title"];
  $singular = true;
  $action = "edit";
  $otherTitle = ucwords($action) . " " . ucwords($title);
  if ($id === $_SESSION["user"]) {
      $userPage = true;
  }
  include("../assets/php/header.php");
  $result = $mysqli->query("SELECT * FROM yourmood.{$type} WHERE id='{$id}'");

  if ($result->num_rows) {
      $row = $result->fetch_assoc();
      $fieldInfo = mysqli_fetch_field($result);
  }

  while ($column = $result->fetch_field()) {
      $columnTypes[$column->name] = $column->type;
  }

?>

<h1 class="text-center">Edit <?php echo ucwords($title); ?></h1>
<br>

<form class="form-group text-center container" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $type; ?>">
  <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">

<?php

  set_error_handler("warning_handler", E_WARNING);
  foreach ($row as $key => $val) {
      if ($key !== "id" && $key !== "password") {
          $columnType = $columnTypes[$key];
          switch ($columnType):
          case 252:
?>

            <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
            <textarea id="<?php echo $key; ?>" class="form-control" name="values[<?php echo $key; ?>]"><?php echo $val; ?></textarea>
            <br>

<?php
          break;

          case 1:

            if ($type === "users" && $id === $_SESSION["user"] && $key === "read_only") {
              $hidden = true;
            }

?>
            <div class="<?php echo isset($hidden) ? "d-none" : ""; ?>">
              <div class="form-check">
                <label class="form-check-label">
                  <input type="hidden" name="values[<?php echo $key; ?>]" value="0">
                  <input type="checkbox" class="form-check-input" <?php echo $val ? "checked" : ""; ?> name="values[<?php echo $key; ?>]" value="1">
                  <?php echo $key; ?>
                </label>
              </div>
              <br>
            </div>

<?php
          break;

          case 253:

?>

            <div class="form-group">
              <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
              <input type="text" class="form-control" id="<?php echo $key; ?>" value="<?php echo $val; ?>" name="values[<?php echo $key; ?>]">
            </div>
            <div class="validation-errors text-danger" data-input="<?php echo $key; ?>"></div>
            <br>

<?php
        break;

        case 3:

?>

            <div class="form-group">
              <label for="<?php echo $key; ?>"><?php echo $key; ?></label>
              <input type="number" class="form-control" id="<?php echo $key; ?>" value="<?php echo $val; ?>" name="values[<?php echo $key; ?>]">
            </div>
            <br>

<?php

        break;

        endswitch;
      }
  }

  if ($type === "users"):

?>

    <div class="form-group">
      <label for="password">password <span id="password_strength"></span></label>
      <input type="password" id="password" class="form-control" name="values[password]" placeholder="Unchanged" autocomplete="new-password"></input>
    </div>
    <div class="validation-errors text-danger" data-input="password"></div>
    <br>
    <div class="form-group">
      <label for="password_confirmation">password confirmation</label>
      <input type="password" id="password_confirmation" class="form-control" name="password_confirmation" disabled></input>
    </div>
    <div class="validation-errors text-danger" data-input="password_confirmation"></div>
    <br>

<?php

    endif;

  restore_error_handler();

  function warning_handler($errno, $errstr)
  {
      global $title;
      global $type;
      $_SESSION["message"]["danger"] = "An error occured.";
      header("location: ../{$title}s?type={$type}");
  }

?>

  <button id="save-button" class="btn btn-lg btn-success submit" type="button" data-action="edit" data-class="success" data-toggle="modal" data-target="#modal">Save</button>
  <?php if (in_array("view", $actions)): ?>
    <a class="btn btn-lg btn-primary" href="../view?type=<?php echo $type; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Cancel</a>
  <?php else: ?>
    <a class="btn btn-lg btn-primary" href="../<?php echo $title; ?>s?type=<?php echo $type; ?>">Cancel</a>
  <?php endif; ?>
  <?php if (in_array("delete", $actions)): ?>
    <button class="btn btn-lg btn-danger submit" type="button" data-action="delete" data-class="danger" data-toggle="modal" data-target="#modal">Delete</button>
  <?php endif; ?>
</form>

<script>let itemId = <?php echo $id; ?></script>
<script src="input_validation.js"></script>

<?php include("../assets/php/footer.html"); ?>
