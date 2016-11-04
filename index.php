<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="CACHE-CONTROL" content="NO-CACHE">
    <meta name="viewport"
      content="width=device-width,initial-scale=1,user-scalable=no">
    <meta name="description" content="">
    <meta name="author" content="Adarsh Sinha">

    <title>World Of</title>

    <script src="config.js"></script>
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/underscore/underscore-min.js"></script>
    <script src="node_modules/angular-aria/angular-aria.min.js"></script>
    <script src="node_modules/angular-animate/angular-animate.min.js"></script>
    <script src="node_modules/angular-sanitize/angular-sanitize.min.js"></script>
    <script src="node_modules/angular-material/angular-material.min.js"></script>
    <script src="node_modules/angular-ui-router/release/angular-ui-router.min.js"></script>

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
    <link rel="stylesheet"
      href="node_modules/angular-material/angular-material.css">

     <!--material -->

    <link rel="icon"
      type="image/png"
      href="img/logo.png">

    <!-- fonts -->
    <link href="https://fonts.googleapis.com/css?family=Aguafina+Script"
      rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Abel"
    rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">

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
                  $split = explode(".", $path);
                  if (in_array("js", $split)) {
                    echo "<script src=\"{$path}\"></script>\n\t";
                  }
              }
          }
      }
      $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator('js/'));
      recurse($iterator);
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