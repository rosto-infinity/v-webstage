import { queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../wayfinder';
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
export const logiciel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logiciel.url(options),
    method: 'get',
});

logiciel.definition = {
    methods: ['get', 'head'],
    url: '/genie-logiciel',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
logiciel.url = (options?: RouteQueryOptions) => {
    return logiciel.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
logiciel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logiciel.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
logiciel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logiciel.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
const logicielForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logiciel.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
logicielForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logiciel.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
logicielForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logiciel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

logiciel.form = logicielForm;

const genie = {
    logiciel: Object.assign(logiciel, logiciel),
};

export default genie;
