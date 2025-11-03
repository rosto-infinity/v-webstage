import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\HomeController::welcome
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
export const welcome = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})

welcome.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HomeController::welcome
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
welcome.url = (options?: RouteQueryOptions) => {
    return welcome.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::welcome
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
welcome.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HomeController::welcome
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
welcome.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: welcome.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HomeController::welcome
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
const welcomeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: welcome.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HomeController::welcome
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
welcomeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: welcome.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HomeController::welcome
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
welcomeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: welcome.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

welcome.form = welcomeForm

const HomeController = { welcome }

export default HomeController