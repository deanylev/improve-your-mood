<?php

  $singular = true;
  $title = "home";
  include("../assets/php/header.php");

?>

<div class="list-group container">
  <a href="../quotes?type=improve" class="list-group-item">
    <h4 class="list-group-item-heading">Improve Quotes</h4>
    <p class="list-group-item-text">Quotes that will be displayed on Improve Your Mood.</p>
  </a>
  <a href="../quotes?type=decrease" class="list-group-item">
    <h4 class="list-group-item-heading">Decrease Quotes</h4>
    <p class="list-group-item-text">Quotes that will be displayed on Decrease Your Mood.</p>
  </a>
  <a href="../colours" class="list-group-item">
    <h4 class="list-group-item-heading">Colours</h4>
    <p class="list-group-item-text">Colours that the background will choose from.</p>
  </a>
  <a href="../settings" class="list-group-item">
    <h4 class="list-group-item-heading">Settings</h4>
    <p class="list-group-item-text">Settings that the client will use.</p>
  </a>
</div>

<?php

  include("../assets/php/footer.php");

?>
