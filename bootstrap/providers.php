<?php

declare(strict_types=1);

use App\Providers\AppServiceProvider;
use Barryvdh\Debugbar\ServiceProvider;
use Illuminate\Auth\AuthServiceProvider;

return [
    AppServiceProvider::class,
    ServiceProvider::class,
    AuthServiceProvider::class,

];
