# Improve Your Mood

**Live Version Here:** https://improveyourmood.xyz

Includes both the back-end and front-end.

To get started, clone the repo into your desired web server, make a new file in /assets/php/ called `settings.ini` and in it, enter both your MySQL credentials and a random cookie encryption key in this format:

```
[MYSQL]
host = YourHost
username = YourUsername
password = YourPassword
[KEYS]
cookie = LongRandomValue (eg. ejr890e9ah8453h89rnudfn)
```

(if writing permissions are enabled on the directory, this file will be created automatically with these placeholder values when you first visit /admin/ in your web browser.)

Then, make a new table in your DB called `yourmood` and import the provided `yourmood.sql` file (in the /assets/sql/ folder).

Make sure your web server is configured to use the provided `.htaccess` file, as it forbids external access to this settings file (otherwise your credentials could be viewed by anyone).

If you would like to point the app to your custom back-end, you simply open the settings panel, go into Advanced Settings, and enter your desired address (this needs to be the folder of wherever you've installed Improve Your Mood, eg. `localhost/improveyourmood_web`). The application will perform an AJAX call to your address to verify its validity.

Right now the admin panel uses MD5 password hashing, which I'll fix at some point.

**NOTE:**

The default credentials are `admin` and `password`.
