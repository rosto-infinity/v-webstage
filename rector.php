<?php

declare(strict_types=1);

use Rector\CodeQuality\Rector\Class_\CompleteDynamicPropertiesRector;
use Rector\Config\RectorConfig;
use Rector\EarlyReturn\Rector\Return_\ReturnBinaryOrToEarlyReturnRector;
use Rector\Set\ValueObject\LevelSetList;
use Rector\Set\ValueObject\SetList;
use Rector\ValueObject\PhpVersion;

return static function (RectorConfig $rectorConfig): void {
    // -- chemins à analyser
    $rectorConfig->paths([
        __DIR__.'/app',
        __DIR__.'/bootstrap',
        __DIR__.'/config',
        __DIR__.'/public',
        __DIR__.'/resources',
        __DIR__.'/routes',
        __DIR__.'/tests',
    ]);

    // -- ensembles de règles (Sets) à appliquer
    $rectorConfig->sets([
        LevelSetList::UP_TO_PHP_83,
        SetList::CODE_QUALITY,
        SetList::TYPE_DECLARATION,

    ]);

    // -- exclusions (skip) : chemins ou règles à ignorer
    $rectorConfig->skip([
        __DIR__.'/app/Listeners',
        ReturnBinaryOrToEarlyReturnRector::class,
        CompleteDynamicPropertiesRector::class,
    ]);

    // -- version PHP ciblée
    $rectorConfig->phpVersion(PhpVersion::PHP_83);

    // -- usage des prepared sets pour affiner
    $rectorConfig->importNames();
    $rectorConfig->importShortClasses();
};
