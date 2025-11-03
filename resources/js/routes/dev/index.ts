import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dev-app'
*/
export const app = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: app.url(options),
    method: 'get',
})

app.definition = {
    methods: ["get","head"],
    url: '/dev-app',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dev-app'
*/
app.url = (options?: RouteQueryOptions) => {
    return app.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dev-app'
*/
app.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: app.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dev-app'
*/
app.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: app.url(options),
    method: 'head',
})

const dev = {
    app: Object.assign(app, app),
}

export default dev