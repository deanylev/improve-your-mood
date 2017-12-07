<?php

  @session_start();

  include("force_auth.php");
  include("../../assets/php/sql.php");
  include("actions.php");

  $titles = array("user", "home", "quote", "colour", "setting", "log");

  $titlePairs = array("users" => "user", "improve"=>"quote", "decrease"=>"quote", "colours"=>"colour", "settings"=>"setting", "logs"=>"log");

  if (!in_array($title, $titles) || (isset($id) && $id === "0") || (isset($type) && !array_key_exists($type, $titlePairs) && !array_key_exists("{$type}s", $titlePairs)) || (isset($type) && array_key_exists($type, $titlePairs) && $titlePairs[$type] !== $title) || (isset($action) && !in_array($action, $actions))) {
      $_SESSION["message"]["danger"] = "An error occured. (001)";
      header("location: ../home");
      die();
  }

  if (isset($table)) {
    $numRows = $mysqli->query("SELECT * FROM yourmood.{$table}")->num_rows;
    $items = isset($_GET["items"]) ? $_GET["items"] : $currentUser["items_per_page"];
    if (!isset($_GET["page"]) && $numRows > $items) {
      $_GET["page"] = 1;
    }
  }

  $pageTitle = isset($otherTitle) ? $otherTitle : ucwords($title);

  if (!isset($singular)) {
    $pageTitle .= "s";
  }

?>
<!DOCTYPE html>
<html lang="en" data-type="<?php echo isset($type) ? $type : "unknown"; ?>" data-items="<?php echo isset($items) ? $items : "unknown"; ?>">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Admin Panel - <?php echo isset($userPage) ? ucwords($action) . " Your Profile" : $pageTitle; ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/file-uploader/5.15.4/s3.jquery.fine-uploader/fine-uploader.min.css">
  <link rel="stylesheet" href="../assets/css/main.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.0/jquery.mark.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.5/umd/popper.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/file-uploader/5.15.4/jquery.fine-uploader/jquery.fine-uploader.min.js"></script>
  <script type="text/template" id="qq-template">
    <div class="qq-uploader-selector qq-uploader" qq-drop-area-text="Drop files here">
        <div class="qq-upload-button-selector btn-dark btn-lg" style="margin: 0 auto; width: 105px;">
            <div>Upload</div>
        </div>
        <br>
        <span class="qq-drop-processing-selector qq-drop-processing">
            <span>Processing dropped files...</span>
            <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
        </span>
        <ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">
            <li>
                <div class="qq-progress-bar-container-selector">
                    <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
                </div>
                <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
                <img class="qq-thumbnail-selector" qq-max-size="100" qq-server-scale>
                <span class="qq-upload-file-selector qq-upload-file"></span>
                <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>
                <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
                <span class="qq-upload-size-selector qq-upload-size"></span>
                <button type="button" class="btn btn-light qq-btn qq-upload-cancel-selector qq-upload-cancel">Cancel</button>
                <button type="button" class="btn btn-light qq-btn qq-upload-delete-selector qq-upload-delete">Delete</button>
                <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
                <span role="reason" class="qq-upload-status-text-selector qq-upload-status-text"></span>
            </li>
        </ul>

        <dialog class="qq-alert-dialog-selector">
            <div class="qq-dialog-message-selector"></div>
            <div class="qq-dialog-buttons">
                <button type="button" class="qq-cancel-button-selector">Close</button>
            </div>
        </dialog>

        <dialog class="qq-confirm-dialog-selector">
            <div class="qq-dialog-message-selector"></div>
            <div class="qq-dialog-buttons">
                <button type="button" class="qq-cancel-button-selector">No</button>
                <button type="button" class="qq-ok-button-selector">Yes</button>
            </div>
        </dialog>

        <dialog class="qq-prompt-dialog-selector">
            <div class="qq-dialog-message-selector"></div>
            <input type="text">
            <div class="qq-dialog-buttons">
                <button type="button" class="qq-cancel-button-selector">Cancel</button>
                <button type="button" class="qq-ok-button-selector">Ok</button>
            </div>
        </dialog>
    </div>
  </script>
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a <?php echo $currentUser["is_admin"] ? "href=\"../home\"" : "" ?> class="navbar-brand">MoodBackend</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="main-nav">
      <?php if ($currentUser["is_admin"]): ?>
        <ul class="nav navbar-nav">
          <li class="nav-item <?php echo $title === "user" ? "active" : "" ?>">
            <a class="nav-link" href="../users">
              <span class="fa fa-user"></span>
              <span class="icon-text">Users</span>
            </a>
          </li>
          <li class="nav-item <?php echo isset($type) && $type === "improve" ? "active" : "" ?>">
            <a class="nav-link" href="../quotes?type=improve">
              <span class="fa fa-quote-left"></span>
              <span class="icon-text">Improve Quotes</span>
            </a>
          </li>
          <li class="nav-item <?php echo isset($type) && $type === "decrease" ? "active" : "" ?>">
            <a class="nav-link" href="../quotes?type=decrease">
              <span class="fa fa-quote-right"></span>
              <span class="icon-text">Decrease Quotes</span>
            </a>
          </li>
          <li class="nav-item <?php echo $title === "colour" ? "active" : "" ?>">
            <a class="nav-link" href="../colours">
              <span class="fa fa-eyedropper"></span>
              <span class="icon-text">Colours</span>
            </a>
          </li>
          <li class="nav-item <?php echo $title === "setting" ? "active" : "" ?>">
            <a class="nav-link" href="../settings">
              <span class="fa fa-cog"></span>
              <span class="icon-text">Settings</span>
            </a>
          </li>
          <li class="nav-item <?php echo $title === "log" ? "active" : "" ?>">
            <a class="nav-link" href="../logs">
              <span class="fa fa-file-text"></span>
              <span class="icon-text">Logs</span>
            </a>
          </li>
          <div class="dropdown-divider"></div>
          <li class="nav-item d-lg-none <?php echo isset($userPage) && $userPage === "view" ? "active" : "" ?>">
            <a class="nav-link"  href="../view/?type=users&amp;title=user&amp;id=<?php echo $_SESSION["user"]; ?>">
              <img class="nav-user-image" src="../users/image.php?id=<?php echo $_SESSION["user"]; ?>">
              <span class="icon-text"><?php echo $currentUser["name"]; ?></span>
            </a>
          </li>
          <li class="nav-item d-lg-none <?php echo isset($userPage) && $userPage === "edit" ? "active" : "" ?>">
            <a class="nav-link" href="../edit/?type=users&amp;title=user&amp;id=<?php echo $_SESSION["user"]; ?>">
              <span class="fa fa-cog"></span>
              <span class="icon-text">Edit Profile</span>
            </a>
          </li>
          <li class="nav-item d-lg-none">
            <a class="nav-link" href="../logout">
              <span class="fa fa-sign-out"></span>
              <span class="icon-text">Log Out</span>
            </a>
          </li>
        </ul>
      <?php endif; ?>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <div class="btn-group d-none d-lg-block d-xl-block">
            <a class="btn btn-primary <?php echo isset($userPage) && $userPage === "view" ? "active" : "" ?>" href="../view/?type=users&amp;title=user&amp;id=<?php echo $_SESSION["user"]; ?>">
              <img class="nav-user-image" src="../users/image.php?id=<?php echo $_SESSION["user"]; ?>">
              <span class="icon-text"><?php echo $currentUser["name"]; ?></span>
            </a>
            <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item <?php echo isset($userPage) && $userPage === "edit" ? "active" : "" ?>" href="../edit/?type=users&amp;title=user&amp;id=<?php echo $_SESSION["user"]; ?>">
                <span class="fa fa-cog"></span>
                <span class="icon-text">Edit Profile</span>
              </a>
              <a class="dropdown-item" href="../logout">
                <span class="fa fa-sign-out"></span>
                <span class="icon-text">Log Out</span>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Are You Sure?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body"><span id="modal-confirm"></span></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button id="modal-submit" type="button" class="btn">OK<i class="d-none fa fa-spinner fa-pulse fa-fw"></i></button>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <?php

      if (isset($_SESSION["message"])) {
          foreach ($_SESSION["message"] as $key => $val): ?>

      <div class="alert margin alert-<?php echo $key; ?>">
        <?php echo $val; ?>
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
      </div>

    <?php

      unset($_SESSION["message"]);
          endforeach;
      }

    ?>

    <?php

      if (isset($_SESSION["errors"])) {
          foreach ($_SESSION["errors"] as $object) {
            foreach ($object as $key => $val): ?>

      <div class="alert margin alert-danger">
        <?php echo $key; ?>: <?php echo $val; ?>
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
      </div>

    <?php

      unset($_SESSION["errors"]);
          endforeach;
        }
      }

    ?>
  </div>
  <br>
