# World Of [Development]
World Of is a platform for the creation of CYOA-style digital fiction. This repo maintains the codebase for this project.

## Getting Started
Clone this repo locally. Refer to the Git Workflows page on the Wiki for more information on working with Git. You can get the GitHub Desktop client to help out as it's useful if you're not familiar or not comfortable with the command line, especially on Windows!

After you've done so, you will need to do a couple of things to get the project running:

1. Ensure node/npm are installed.

2. Run 'npm install' within the world-of folder (If you're on Windows, you can do this from the git shell that comes with the Github Desktop client - it uses unix commands). This will execute the dependencies that are specified in package.json, which are needed.

3. Create api/config.php and define PHP constants for DB_HOST, DB_USER, DB_PASS, and DB that store the respective mysql connection details. Just take the following code and replace the second parameter in each of the definitions with the correct string values. This file will also hold a variable called BASE_HREF, which should be set to the path to your working directory, with the root set to your localhost root (i.e. if you access this from localhost:8888/world-of, where world-of is your working directory, the value should be "/world-of/").

 ```php
<?php
  define("DB_HOST", "your_db_host..usually localhost");
  define("DB_USER", "your_db_username..usually root");
  define("DB_PASS", "your_db_pass");
  define("DB", "worldof_db");

  define("BASE_HREF", "/");
?>
```

4. Create config.js (at the root level within your world-of folder) with the following data:

 ```javascript
var configJson = {
  "baseURL": "http://__your___local__host__url/world-of/api"
};
```

5. Create your local database using the schema found in the SQL folder.

6. Create a file called ".htaccess" in the root of your working directory. Paste the following into it. Where you see the text "world-of" in the last rewrite rule, replace it with whatever is the name of you working directory. If you are working in the root of your server (i.e. localhost/ sends you to World Of), then delete "world-of".

 ```php
RewriteEngine On
Options FollowSymLinks

RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ world-of/#/$1 [L]
```

## Our Work
Almost all files in this repo have been written by us from scratch. The files that haven't been written by us are just the PHP Slim API Framework files (i.e. any file in api/ that isn't index.php, db.php, auth.php, or the .htaccess are files that belong to the Slim PHP Framework and haven't been written by us). Speaking in terms of numbers, as can be seen in the without-slim branch, all the Slim files account for about 15.5k LOC. The remaining LOC are all ours (approximately 5k).
