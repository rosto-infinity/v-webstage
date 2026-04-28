 Route::get('settings/dbbackup', [DBBackupController::class, 'index'])
        ->name('dbbackup');

    Route::get('settings/dbbackup/download', [DBBackupController::class, 'download'])
        ->name('dbbackup.download');

    Route::post('settings/dbbackup/create', [DBBackupController::class, 'create'])
        ->name('dbbackup.create');