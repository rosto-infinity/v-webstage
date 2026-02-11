import { applyUrlDefaults, queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../wayfinder';
/**
 * @see \App\Http\Controllers\Settings\StageController::store
 * @see app/Http/Controllers/Settings/StageController.php:33
 * @route '/settings/stages'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/settings/stages',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Settings\StageController::store
 * @see app/Http/Controllers/Settings/StageController.php:33
 * @route '/settings/stages'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Settings\StageController::store
 * @see app/Http/Controllers/Settings/StageController.php:33
 * @route '/settings/stages'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Settings\StageController::store
 * @see app/Http/Controllers/Settings/StageController.php:33
 * @route '/settings/stages'
 */
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Settings\StageController::store
 * @see app/Http/Controllers/Settings/StageController.php:33
 * @route '/settings/stages'
 */
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Settings\StageController::update
 * @see app/Http/Controllers/Settings/StageController.php:81
 * @route '/settings/stages/{stage}'
 */
export const update = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/settings/stages/{stage}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Settings\StageController::update
 * @see app/Http/Controllers/Settings/StageController.php:81
 * @route '/settings/stages/{stage}'
 */
update.url = (args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stage: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { stage: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            stage: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        stage: typeof args.stage === 'object' ? args.stage.id : args.stage,
    };

    return update.definition.url.replace('{stage}', parsedArgs.stage.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Settings\StageController::update
 * @see app/Http/Controllers/Settings/StageController.php:81
 * @route '/settings/stages/{stage}'
 */
update.put = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Settings\StageController::update
 * @see app/Http/Controllers/Settings/StageController.php:81
 * @route '/settings/stages/{stage}'
 */
const updateForm = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Settings\StageController::update
 * @see app/Http/Controllers/Settings/StageController.php:81
 * @route '/settings/stages/{stage}'
 */
updateForm.put = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;

/**
 * @see \App\Http\Controllers\Settings\StageController::destroy
 * @see app/Http/Controllers/Settings/StageController.php:140
 * @route '/settings/stages/{stage}'
 */
export const destroy = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/settings/stages/{stage}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Settings\StageController::destroy
 * @see app/Http/Controllers/Settings/StageController.php:140
 * @route '/settings/stages/{stage}'
 */
destroy.url = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stage: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { stage: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            stage: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        stage: typeof args.stage === 'object' ? args.stage.id : args.stage,
    };

    return destroy.definition.url.replace('{stage}', parsedArgs.stage.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Settings\StageController::destroy
 * @see app/Http/Controllers/Settings/StageController.php:140
 * @route '/settings/stages/{stage}'
 */
destroy.delete = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Settings\StageController::destroy
 * @see app/Http/Controllers/Settings/StageController.php:140
 * @route '/settings/stages/{stage}'
 */
const destroyForm = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Settings\StageController::destroy
 * @see app/Http/Controllers/Settings/StageController.php:140
 * @route '/settings/stages/{stage}'
 */
destroyForm.delete = (
    args: { stage: number | { id: number } } | [stage: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;

const stages = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default stages;
