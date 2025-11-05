import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:200
* @route '/admin/dashboard'
*/
export const admin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admin.url(options),
    method: 'get',
})

admin.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:200
* @route '/admin/dashboard'
*/
admin.url = (options?: RouteQueryOptions) => {
    return admin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:200
* @route '/admin/dashboard'
*/
admin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:200
* @route '/admin/dashboard'
*/
admin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: admin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:200
* @route '/admin/dashboard'
*/
const adminForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: admin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:200
* @route '/admin/dashboard'
*/
adminForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: admin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:200
* @route '/admin/dashboard'
*/
adminForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: admin.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

admin.form = adminForm

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:27
* @route '/superadmin/dashboard'
*/
export const superadmin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superadmin.url(options),
    method: 'get',
})

superadmin.definition = {
    methods: ["get","head"],
    url: '/superadmin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:27
* @route '/superadmin/dashboard'
*/
superadmin.url = (options?: RouteQueryOptions) => {
    return superadmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:27
* @route '/superadmin/dashboard'
*/
superadmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superadmin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:27
* @route '/superadmin/dashboard'
*/
superadmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: superadmin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:27
* @route '/superadmin/dashboard'
*/
const superadminForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: superadmin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:27
* @route '/superadmin/dashboard'
*/
superadminForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: superadmin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:27
* @route '/superadmin/dashboard'
*/
superadminForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: superadmin.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

superadmin.form = superadminForm

const DashboardController = { admin, superadmin }

export default DashboardController