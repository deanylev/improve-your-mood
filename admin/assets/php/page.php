<?php

  include("header.php");
  $numRows = $mysqli->query("SELECT * FROM yourmood.{$table}")->num_rows;
  $items = isset($_GET["items"]) ? $_GET["items"] : 500;
  if (!isset($_GET["page"]) && $numRows > $items) {
    $_GET["page"] = 1;
  }
  if (isset($_GET["page"])) {
    $page = isset($_GET["page"]) ? intval($_GET["page"]) : "";
    $totalPages = max(ceil($numRows / $items), 1);
    $offset = $items * ($page - 1);
  }
  $limit = $numRows > $items ? "LIMIT {$offset}, {$items}" : "";
  $result = $mysqli->query("SELECT * FROM yourmood.{$table} {$limit}");
  $currentRows = $result->num_rows;
  $dbColumns = $mysqli->query("DESCRIBE yourmood.{$table}");
  $forbiddenKeys = array("id", "active", "log", "password");

?>

<div class="text-center">
  <h1><?php echo ucwords($title); ?>s (<span id="results-number"><?php echo $currentRows; ?></span>/<?php echo $numRows; ?>)</h1>
  <?php if (isset($page) && $totalPages > 1): ?>
    <br>
    <?php if ($page > 1): ?>
      <a href="?page=1&amp;items=<?php echo $items; ?>" class="btn btn-info"><span class="fa fa-step-backward"></span></a>
      <a href="?page=<?php echo $page - 1; ?>&amp;items=<?php echo $items; ?>" class="btn btn-info"><span class="fa fa-backward"></span></a>
    <?php endif; ?>
    <span>&nbsp;Page: <?php echo $page; ?>/<?php echo $totalPages; ?>&nbsp;</span>
    <?php if ($page < $totalPages): ?>
      <a href="?page=<?php echo $page + 1; ?>&amp;items=<?php echo $items; ?>" class="btn btn-info"><span class="fa fa-forward"></span></a>
      <a href="?page=<?php echo $totalPages; ?>&amp;items=<?php echo $items; ?>" class="btn btn-info"><span class="fa fa-step-forward"></span></a>
    <?php endif; ?>
  <?php endif; ?>
</div>

<br>

<?php if ($result->num_rows): ?>
  <div class="text-center show-on-load d-none">
    <select name="field">
      <?php while ($row = $dbColumns->fetch_assoc()) { ?>
        <?php $field = $row["Field"]; ?>
        <?php if (!in_array($field, $forbiddenKeys)): ?>
          <option value="<?php echo $field; ?>" <?php echo $field === $title ? "selected" : ""; ?>><?php echo $field; ?></option>
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
    <br><br>
    <input id="case-sensitive" type="checkbox">
    <label>Case Sensitive?</label>
  </div>
<?php endif; ?>

<br>

<form class="container show-on-load d-none" action="../modify.php" method="POST">
  <input type="hidden" name="table" value="<?php echo $table; ?>">
  <input type="hidden" name="type" value="<?php echo $title; ?>">
  <?php if (in_array("create", $actions)): ?>
    <button class="btn btn-lg btn-primary submit" type="button" data-action="new" data-undo="true" data-confirm="creating a new <?php echo $title; ?>" data-class="primary" data-toggle="modal" data-target="#modal">New <?php echo ucwords($title); ?></button>
  <?php endif; ?>
  <button id="delete-selected-button" class="btn btn-lg btn-danger submit d-none" type="button" data-title="<?php echo $title; ?>" data-action="deletemultiple" data-class="danger" data-toggle="modal" data-target="#modal">Delete Selected <?php echo ucwords($title); ?>s (<span id="selected-number"></span>)</button>
  <?php if (in_array("deleteall", $actions) && $result->num_rows): ?>
    <button class="btn btn-lg btn-danger submit" type="button" data-action="deleteall" data-confirm="deleting all <?php echo $title; ?>s" data-class="danger" data-toggle="modal" data-target="#modal">Delete All <?php echo ucwords($title); ?>s</button>
  <?php endif; ?>
  <br><br>
</form>
<section class="section pre-loader">
    <span class="loader loader1"></span>
    Loading...
</section>
<form id="main-form" action="../modify.php" method="POST">
  <div class="table-responsive">
    <table class="table table-striped show-on-load d-none">
      <thead>
        <tr>
          <th></th>
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
                $quote = strpos($val, "\"") ? "'" : "\"";
                $fields .= " data-{$key}={$quote}{$val}{$quote}";
              }
            }

    ?>

        <tr class="item"<?php echo $fields; ?>>
          <td><input class="select-checkbox" type="checkbox" name="items[]" value="<?php echo $row["id"]; ?>"></td>
          <?php if (!isset($notDefault)): ?>
            <td><p><?php echo $row[$title]; ?></p></td>
          <?php endif; ?>
          <?php isset($customFields) ? include($customFields) : ""; ?>
          <td class="preview d-none"></td>
          <td class="actions">
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
              <button class="btn btn-danger submit" type="button" data-action="delete" data-confirm="deleting a <?php echo $title; ?>" data-class="danger" data-toggle="modal" data-target="#modal">Delete</button>
            <?php endif; ?>
          </td>
        </tr>

    <?php

        endwhile;
      }

    ?>

      </tbody>
    </table>
  </div>
</form>
<?php include("footer.html"); ?>
