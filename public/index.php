<?php
declare(strict_types=1);

$title = 'Memorize Script';

/**
 * Asset URL base for subdirectory installs (MAMP/Apache).
 * - Hit as /.../public/index.php → base = that directory
 * - Included from /.../index.php → base = sibling /public
 */
$scriptName = isset($_SERVER['SCRIPT_NAME']) ? str_replace('\\', '/', (string) $_SERVER['SCRIPT_NAME']) : '/index.php';
$entryDir = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
if ($entryDir === '/' || $entryDir === '\\' || $entryDir === '.') {
    $entryDir = '';
}

$scriptFile = isset($_SERVER['SCRIPT_FILENAME']) ? realpath((string) $_SERVER['SCRIPT_FILENAME']) : false;
$thisFile = realpath(__FILE__);
$servedDirectly = ($scriptFile && $thisFile && $thisFile === $scriptFile);

if ($servedDirectly) {
    $base = $entryDir;
} else {
    $base = ($entryDir === '' ? '' : $entryDir) . '/public';
}

$asset = static function (string $path) use ($base): string {
    $prefix = $base === '' ? '' : $base;
    return htmlspecialchars($prefix . '/' . ltrim($path, '/'), ENT_QUOTES, 'UTF-8');
};

$baseHref = ($base === '' ? '/' : $base . '/');
?><!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title>
    <base href="<?= htmlspecialchars($baseHref, ENT_QUOTES, 'UTF-8') ?>" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="<?= $asset('assets/app.css') ?>" />
  </head>
  <body>
    <div id="app"></div>

    <footer class="site-footer">
      <div class="footer-actions">
        <button type="button" id="tour-btn" class="tour-btn" title="Show tour from the beginning" aria-label="Show tour from the beginning">
          Tour
        </button>
      </div>
      <button type="button" class="credits-toggle" id="credits-toggle" aria-expanded="false" aria-controls="credits-panel">About &amp; credits</button>
      <div id="credits-panel" class="credits-body" hidden>
        <p>Built by Weng Fei Fung</p>
        <div class="socials">
          <a target="_blank" href="https://github.com/Siphon880gh" rel="nofollow">GitHub</a>
          <a target="_blank" href="https://www.linkedin.com/in/weng-fung/" rel="nofollow">LinkedIn</a>
          <a target="_blank" href="https://www.youtube.com/@WayneTeachesCode/" rel="nofollow">YouTube</a>
        </div>
        <p class="credits-legal">Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.</p>
        <p class="credits-legal">Thank you, Crossway, for letting us include it. <a href="https://www.esv.org/" target="_blank" rel="noopener noreferrer">www.esv.org</a></p>
      </div>
    </footer>

    <script src="<?= $asset('assets/js/app.js') ?>" defer></script>
    <script src="<?= $asset('assets/js/tour.js') ?>" defer></script>
  </body>
</html>
