# Improve Your Mood

**Live Version Here:** https://improveyourmood.xyz

Includes both the back-end and front-end.

To get started, clone the repo into your desired web server, and set these env vars:

```
MYSQL_HOST (default "localhost")
MYSQL_USERNAME (default "root")
MYSQL_PASSWORD (default "")
MYSQL_NAME (default "yourmood")
COOKIE_KEY
```

Then, make a new table in your DB called `yourmood` and import the provided `yourmood.sql` file (in the /assets/sql/ folder).

Make sure your web server is configured to use the provided `.htaccess` file.

If you would like to point the app to your custom back-end, you simply open the settings panel, go into Advanced Settings, and enter your desired address (this needs to be the folder of wherever you've installed Improve Your Mood, eg. `localhost/improveyourmood_web`). The application will perform an AJAX call to your address to verify its validity.

Right now the admin panel uses MD5 password hashing, which I'll fix at some point.

**NOTE:**

The default credentials are `admin` and `password`.
