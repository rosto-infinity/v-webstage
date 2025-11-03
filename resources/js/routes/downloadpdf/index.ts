import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserController::presence
* @see app/Http/Controllers/Admin/UserController.php:227
* @route '/dashboard/downloadpdf-presence'
*/
export const presence = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: presence.url(options),
    method: 'get',
})

presence.definition = {
    methods: ["get","head"],
    url: '/dashboard/downloadpdf-presence',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::presence
* @see app/Http/Controllers/Admin/UserController.php:227
* @route '/dashboard/downloadpdf-presence'
*/
presence.url = (options?: RouteQueryOptions) => {
    return presence.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::presence
* @see app/Http/Controllers/Admin/UserController.php:227
* @route '/dashboard/downloadpdf-presence'
*/
presence.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: presence.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::presence
* @see app/Http/Controllers/Admin/UserController.php:227
* @route '/dashboard/downloadpdf-presence'
*/
presence.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: presence.url(options),
    method: 'head',
})

const downloadpdf = {
    presence: Object.assign(presence, presence),
}

export default downloadpdf