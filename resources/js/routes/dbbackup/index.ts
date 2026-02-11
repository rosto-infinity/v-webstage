import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
* @see \App\Http\Controllers\Settings\DBBackupController::download
* @see app/Http/Controllers/Settings/DBBackupController.php:41
* @route '/settings/dbbackup/download'
*/
const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::download
* @see app/Http/Controllers/Settings/DBBackupController.php:41
* @route '/settings/dbbackup/download'
*/
downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::download
* @see app/Http/Controllers/Settings/DBBackupController.php:41
* @route '/settings/dbbackup/download'
*/
downloadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

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

/**
* @see \App\Http\Controllers\Settings\DBBackupController::create
* @see app/Http/Controllers/Settings/DBBackupController.php:57
* @route '/settings/dbbackup/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::create
* @see app/Http/Controllers/Settings/DBBackupController.php:57
* @route '/settings/dbbackup/create'
*/
createForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create.url(options),
    method: 'post',
})

create.form = createForm

const dbbackup = {
    download: Object.assign(download, download),
    create: Object.assign(create, create),
}

export default dbbackup