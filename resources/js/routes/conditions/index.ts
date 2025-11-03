import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/conditions-stage'
*/
export const stage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stage.url(options),
    method: 'get',
})

stage.definition = {
    methods: ["get","head"],
    url: '/conditions-stage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/conditions-stage'
*/
stage.url = (options?: RouteQueryOptions) => {
    return stage.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/conditions-stage'
*/
stage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stage.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/conditions-stage'
*/
stage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stage.url(options),
    method: 'head',
})

const conditions = {
    stage: Object.assign(stage, stage),
}

export default conditions