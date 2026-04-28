Laravel
Require this package in your composer.json and update composer. This will download the package and the dompdf + fontlib libraries also.

composer require barryvdh/laravel-dompdf
Lumen
After updating composer add the following lines to register provider in bootstrap/app.php

$app->register(\Barryvdh\DomPDF\ServiceProvider::class);
To change the configuration, copy the config file to your config folder and enable it in bootstrap/app.php:

$app->configure('dompdf');
Using
You can create a new DOMPDF instance and load a HTML string, file or view name. You can save it to a file, or stream (show in browser) or download.

    use Barryvdh\DomPDF\Facade\Pdf;

    $pdf = Pdf::loadView('pdf.invoice', $data);
    return $pdf->download('invoice.pdf');
or use the App container:

    $pdf = App::make('dompdf.wrapper');
    $pdf->loadHTML('<h1>Test</h1>');
    return $pdf->stream();
Or use the facade:

You can chain the methods:

    return Pdf::loadFile(public_path().'/myfile.html')->save('/path-to/my_stored_file.pdf')->stream('download.pdf');
You can change the orientation and paper size, and hide or show errors (by default, errors are shown when debug is on)

    Pdf::loadHTML($html)->setPaper('a4', 'landscape')->setWarnings(false)->save('myfile.pdf')
If you need the output as a string, you can get the rendered PDF with the output() function, so you can save/output it yourself.

Use php artisan vendor:publish to create a config file located at config/dompdf.php which will allow you to define local configurations to change some settings (default paper etc). You can also use your ConfigProvider to set certain keys.

Configuration
The defaults configuration settings are set in config/dompdf.php. Copy this file to your own config directory to modify the values. You can publish the config using this command:

    php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
You can still alter the dompdf options in your code before generating the pdf using this command:

    Pdf::setOption(['dpi' => 150, 'defaultFont' => 'sans-serif']);
Available options and their defaults:

rootDir: "{app_directory}/vendor/dompdf/dompdf"
tempDir: "/tmp" (available in config/dompdf.php)
fontDir: "{app_directory}/storage/fonts" (available in config/dompdf.php)
fontCache: "{app_directory}/storage/fonts" (available in config/dompdf.php)
chroot: "{app_directory}" (available in config/dompdf.php)
logOutputFile: "/tmp/log.htm"
defaultMediaType: "screen" (available in config/dompdf.php)
defaultPaperSize: "a4" (available in config/dompdf.php)
defaultFont: "serif" (available in config/dompdf.php)
dpi: 96 (available in config/dompdf.php)
fontHeightRatio: 1.1 (available in config/dompdf.php)
isPhpEnabled: false (available in config/dompdf.php)
isRemoteEnabled: false (available in config/dompdf.php)
isJavascriptEnabled: true (available in config/dompdf.php)
isHtml5ParserEnabled: true (available in config/dompdf.php)
allowedRemoteHosts: null (available in config/dompdf.php)
isFontSubsettingEnabled: false (available in config/dompdf.php)
debugPng: false
debugKeepTemp: false
debugCss: false
debugLayout: false
debugLayoutLines: true
debugLayoutBlocks: true
debugLayoutInline: true
debugLayoutPaddingBox: true
pdfBackend: "CPDF" (available in config/dompdf.php)
pdflibLicense: ""
adminUsername: "user"
adminPassword: "password"
artifactPathValidation: null (available in config/dompdf.php)
Note: Since 3.x the remote access is disabled by default, to provide more security. Use with caution!
Tip: UTF-8 support
In your templates, set the UTF-8 Metatag:

<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
Tip: Page breaks
You can use the CSS page-break-before/page-break-after properties to create a new page.

<style>
.page-break {
    page-break-after: always;
}
</style>
<h1>Page 1</h1>
<div class="page-break"></div>
<h1>Page 2</h1>