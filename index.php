<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="CACHE-CONTROL" content="NO-CACHE">
    <meta name="viewport"
      content="width=device-width,initial-scale=1,user-scalable=no">
    <?php
      require('api/meta.php');
    ?>

    <script src="config.js"></script>
    <script src="node_modules/tinymce/tinymce.min.js"></script>
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-ui-tinymce/src/tinymce.js"></script>
    <script src="node_modules/underscore/underscore-min.js"></script>
    <script src="node_modules/angular-aria/angular-aria.min.js"></script>
    <script src="node_modules/angular-animate/angular-animate.min.js"></script>
    <script src="node_modules/angular-sanitize/angular-sanitize.min.js"></script>
    <script src="node_modules/angular-material/angular-material.min.js"></script>
    <script src="node_modules/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="node_modules/angular-socialshare/dist/angular-socialshare.min.js"></script>

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <link rel="stylesheet"
      href="node_modules/angular-material/angular-material.css">

     <!--material -->

    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
    <link rel="icon" href="img/favicon.ico" type="image/x-icon">

    <!-- fonts -->
    <link href="https://fonts.googleapis.com/css?family=Aguafina+Script"
      rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Abel"
    rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Dosis" rel="stylesheet">
    <!-- css -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/style_500px.css">

    <script src="js/app.js"></script>
    <script src="js/constants.js"></script>
    <script src="js/jquery-2.1.4.min.js"></script>
    <?php
      // Setup script references by automatically parsing through js/
      function recurse($file)
      {
          foreach ($file as $path) {
              if ($path->isDir())
              {
                  if ($path == "templates/") {
                    return;
                  }
                  recurse($path);
              }
              else
              {
                  if ($path === "js/app.js" || $path === "js/constants.js" || $path === "js/jquery-2.1.4.min.js" ) {
                    return;
                  }

                  $split = explode(".", $path);
                  if (in_array("js", $split)) {
                    echo "<script src=\"{$path}\"></script>\n\t";
                  }
              }
          }
      }
      $folders = ["services", "controllers", "components"];
      foreach ($folders as $folder) {
        $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator('js/'.$folder.'/'));
        recurse($iterator);
      }

    ?>


  </head>

  <body ng-app="worldof">

    <!-- loader -->
    <div id="loaderOverlay" class='loading'>
        <section class='loader centerBox'>
            <img src='img/loader.GIF'>
        </section>
    </div>

    <!-- page -->


    <ui-view>
    </ui-view>


  </body>

</html>
