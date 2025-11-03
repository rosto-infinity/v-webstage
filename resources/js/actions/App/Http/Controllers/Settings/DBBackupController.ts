import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\DBBackupController::index
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/dbbackup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\DBBackupController::index
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DBBackupController::index
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::index
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::download
* @see app/Http/Controllers/Settings/DBBackupController.php:41
* @route '/settings/dbbackup/download'
*/
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/settings/dbbackup/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\DBBackupController::download
* @see app/Http/Controllers/Settings/DBBackupController.php:41
* @route '/settings/dbbackup/download'
*/
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DBBackupController::download
* @see app/Http/Controllers/Settings/DBBackupController.php:41
* @route '/settings/dbbackup/download'
*/
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::download
* @see app/Http/Controllers/Settings/DBBackupController.php:41
* @route '/settings/dbbackup/download'
*/
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::create
* @see app/Http/Controllers/Settings/DBBackupController.php:57
* @route '/settings/dbbackup/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/settings/dbbackup/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\DBBackupController::create
* @see app/Http/Controllers/Settings/DBBackupController.php:57
* @route '/settings/dbbackup/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DBBackupController::create
* @see app/Http/Controllers/Settings/DBBackupController.php:57
* @route '/settings/dbbackup/create'
*/
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

const DBBackupController = { index, download, create }

export default DBBackupController