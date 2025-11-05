import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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

const dashboard = {
    superadmin: Object.assign(superadmin, superadmin),
}

export default dashboard