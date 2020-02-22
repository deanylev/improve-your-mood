<?php

  $key = getenv("COOKIE_KEY");

  function encryptCookie($value)
  {
      global $key;
      $newValue = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $value, MCRYPT_MODE_CBC, md5(md5($key))));
      return($newValue);
  }

  function decryptCookie($value)
  {
      global $key;
      $newValue = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode($value), MCRYPT_MODE_CBC, md5(md5($key))), "\0");
      return($newValue);
  }
