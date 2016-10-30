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

4. Create your local database based on the appropriate details you've specified.
