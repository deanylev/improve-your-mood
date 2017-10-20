<?php

  $singular = true;
  $title = "home";
  include("../assets/php/header.php");

?>

<div class="list-group container">
  <a href="../users" class="list-group-item list-group-item-action">
    <h4 class="list-group-item-heading">
      <span class="fa fa-user"></span>
      <span class="icon-text">Users</span>
    </h4>
    <p class="list-group-item-text">Users that can log in to the admin panel.</p>
  </a>
  <a href="../quotes?type=improve" class="list-group-item list-group-item-action">
    <h4 class="list-group-item-heading">
      <span class="fa fa-quote-left"></span>
      <span class="icon-text">Improve Quotes</span>
    </h4>
    <p class="list-group-item-text">Quotes that will be displayed on Improve Your Mood.</p>
  </a>
  <a href="../quotes?type=decrease" class="list-group-item list-group-item-action">
    <h4 class="list-group-item-heading">
      <span class="fa fa-quote-right"></span>
      <span class="icon-text">Decrease Quotes</span>
    </h4>
    <p class="list-group-item-text">Quotes that will be displayed on Decrease Your Mood.</p>
  </a>
  <a href="../colours" class="list-group-item list-group-item-action">
    <h4 class="list-group-item-heading">
      <span class="fa fa-eyedropper"></span>
      <span class="icon-text">Colours</span>
    </h4>
    <p class="list-group-item-text">Colours that the background will choose from.</p>
  </a>
  <a href="../settings" class="list-group-item list-group-item-action">
    <h4 class="list-group-item-heading">
      <span class="fa fa-cog"></span>
      <span class="icon-text">Settings</span>
    </h4>
    <p class="list-group-item-text">Settings that the client will use.</p>
  </a>
  <a href="../logs" class="list-group-item list-group-item-action">
    <h4 class="list-group-item-heading">
      <span class="fa fa-file-text"></span>
      <span class="icon-text">Logs</span>
    </h4>
    <p class="list-group-item-text">Errors logs that have been sent.</p>
  </a>
</div>

<?php include("../assets/php/footer.html"); ?>
