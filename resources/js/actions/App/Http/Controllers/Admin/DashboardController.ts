import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:164
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
* @see app/Http/Controllers/Admin/DashboardController.php:164
* @route '/admin/dashboard'
*/
admin.url = (options?: RouteQueryOptions) => {
    return admin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:164
* @route '/admin/dashboard'
*/
admin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::admin
* @see app/Http/Controllers/Admin/DashboardController.php:164
* @route '/admin/dashboard'
*/
admin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: admin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:17
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
* @see app/Http/Controllers/Admin/DashboardController.php:17
* @route '/superadmin/dashboard'
*/
superadmin.url = (options?: RouteQueryOptions) => {
    return superadmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:17
* @route '/superadmin/dashboard'
*/
superadmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superadmin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DashboardController::superadmin
* @see app/Http/Controllers/Admin/DashboardController.php:17
* @route '/superadmin/dashboard'
*/
superadmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: superadmin.url(options),
    method: 'head',
})

const DashboardController = { admin, superadmin }

export default DashboardController