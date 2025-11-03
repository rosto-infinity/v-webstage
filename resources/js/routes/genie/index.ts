import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/genie-logiciel'
*/
export const logiciel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logiciel.url(options),
    method: 'get',
})

logiciel.definition = {
    methods: ["get","head"],
    url: '/genie-logiciel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/genie-logiciel'
*/
logiciel.url = (options?: RouteQueryOptions) => {
    return logiciel.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/genie-logiciel'
*/
logiciel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logiciel.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/genie-logiciel'
*/
logiciel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logiciel.url(options),
    method: 'head',
})

const genie = {
    logiciel: Object.assign(logiciel, logiciel),
}

export default genie