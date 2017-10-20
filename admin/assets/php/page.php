<?php

  include("header.php");
  $result = $mysqli->query("SELECT * FROM yourmood.{$table}");
  $forbiddenKeys = array("id", "active", "log", "password");

?>

<h1 class="text-center"><?php echo ucwords($title); ?>s (<span id="results-number"><?php echo $result->num_rows - ($result->num_rows === 0 ? 0 : 1); ?></span>)</h1>

<br>

<?php if ($result->num_rows): ?>
  <div class="text-center">
    <select name="field">
      <?php foreach ($result->fetch_assoc() as $key => $val) { ?>
        <?php if (!in_array($key, $forbiddenKeys)): ?>
          <option value="<?php echo $key; ?>" <?php echo $key === $title ? "selected" : ""; ?>><?php echo $key ?></option>
        <?php endif; ?>
      <?php } ?>
    </select>
    <select name="query">
      <option value="contains">contains</option>
      <option value="equals">equals</option>
      <option value="startswith">starts with</option>
      <option value="endswith">ends with</option>
    </select>
    <input id="search-bar" type="text" name="search" placeholder="search">
  </div>
<?php endif; ?>

<form class="container" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $table; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">
  <?php if (in_array("create", $actions)): ?>
    <input class="btn btn-lg btn-primary" type="submit" name="new" value="New <?php echo ucwords($title); ?>">
  <?php endif; ?>
  <?php if (in_array("deleteall", $actions)): ?>
    <input class="btn btn-lg btn-danger" type="submit" name="deleteall" value="Delete All <?php echo ucwords($title); ?>s">
  <?php endif; ?>
  <br><br>
</form>

<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <?php if (!isset($notDefault)): ?>
          <th><?php echo ucwords($title); ?></th>
        <?php endif; ?>
        <?php echo isset($customHeadings) ? $customHeadings : ""; ?>
        <th class="preview d-none">Preview</th>
        <?php if (in_array("edit", $actions) || in_array("delete", $actions)): ?>
          <th class="actions">Actions</th>
        <?php endif; ?>
      </tr>
    </thead>
    <tbody>

  <?php

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()):

          $fields = "";

          foreach ($row as $key => $val) {
            if (!in_array($key, $forbiddenKeys)) {
              $quote = strpos($val, "'") ? "\"" : "'";
              $fields .= " data-${key}={$quote}{$val}{$quote}";
            }
          }

  ?>

      <tr class="item"<?php echo $fields; ?>>
        <?php if (!isset($notDefault)): ?>
          <td><p><?php echo $row[$title]; ?></p></td>
        <?php endif; ?>
        <?php isset($customFields) ? include($customFields) : ""; ?>
        <th class="preview d-none"></th>
        <td class="actions">
          <form action="../modify.php" method="POST">
            <?php if (in_array("view", $actions)): ?>
              <a class="btn btn-success action-button" href="../view?type=<?php echo $table; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">View</a>
            <?php endif; ?>
            <?php if (in_array("edit", $actions)): ?>
              <a class="btn btn-warning action-button" href="../edit?type=<?php echo $table; ?>&amp;title=<?php echo $title; ?>&amp;id=<?php echo $row["id"]; ?>">Edit</a>
            <?php endif; ?>
            <input type="hidden" name="id" value="<?php echo $row["id"]; ?>">
            <input type="hidden" name="table" value="<?php echo $table; ?>">
            <input type="hidden" name="type" value="<?php echo $title; ?>">
            <?php if (in_array("delete", $actions)): ?>
              <input class="btn btn-danger action-button" type="submit" name="delete" value="Delete">
            <?php endif; ?>
          </form>
        </td>
      </tr>

  <?php

      endwhile;
    }

  ?>
    </tbody>
  </table>
</div>

<?php include("footer.html"); ?>
