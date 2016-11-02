# World Of [Development]
World Of is a platform for the creation of CYOA-style digital fiction. This repo maintains the codebase for this project.

## Getting Started
Clone this repo locally. Refer to the Git Workflows page on the Wiki for more information on working with Git. You can get the GitHub Desktop client to help out as it's useful if you're not familiar or not comfortable with the command line, especially on Windows!

After you've done so, you will need to do a couple of things to get the project running:

1. Ensure node/npm are installed.

2. Run 'npm install' within the world-of folder (If you're on Windows, you can do this from the git shell that comes with the Github Desktop client - it uses unix commands). This will execute the dependencies that are specified in package.json, which are needed.

3. Create api/config.php and define PHP constants for DB_HOST, DB_USER, DB_PASS, and DB that store the respective mysql connection details. Just take the following code and replace the second parameter in each of the definitions with the correct string values.

 ```php
<?php
  define("DB_HOST", "your_db_host..usually localhost");
  define("DB_USER", "your_db_username..usually root");
  define("DB_PASS", "your_db_pass");
  define("DB", "worldof_db");
?>
```

4. Create config.js (at the root level within your world-of folder) with the following data:

 ```javascript
var configJson = {
  "baseURL": "http://__your___local__host__url/world-of/api"
};
```
                
5. Create your local database using the schema found in the SQL folder.

## Our Work
Almost all files in this repo have been written by us from scratch. The files that haven't been written by us are just the PHP Slim API Framework files (i.e. any file in api/ that isn't index.php, db.php, or auth.php are files that belong to the Slim PHP Framework and haven't been written by us).
