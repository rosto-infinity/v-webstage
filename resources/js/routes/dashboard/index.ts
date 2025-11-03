import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
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

const dashboard = {
    superadmin: Object.assign(superadmin, superadmin),
}

export default dashboard