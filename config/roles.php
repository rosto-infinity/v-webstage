<?php

declare(strict_types=1);

return [
    'roles' => explode(',', env('APP_USER_ROLES', 'tre,tre,gtr')),
];
