import { queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../wayfinder';
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
export const stage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stage.url(options),
    method: 'get',
});

stage.definition = {
    methods: ['get', 'head'],
    url: '/guide-stage',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
stage.url = (options?: RouteQueryOptions) => {
    return stage.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
stage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stage.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
stage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stage.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
const stageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stage.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
stageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stage.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
stageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stage.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

stage.form = stageForm;

const guide = {
    stage: Object.assign(stage, stage),
};

export default guide;
