import { queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\PresenceController::zip
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
export const zip = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zip.url(options),
    method: 'get',
});

zip.definition = {
    methods: ['get', 'head'],
    url: '/presences/users/pdf/all-zip',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::zip
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
zip.url = (options?: RouteQueryOptions) => {
    return zip.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::zip
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
zip.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zip.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::zip
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
zip.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: zip.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::zip
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
const zipForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: zip.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::zip
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
zipForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: zip.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::zip
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
zipForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: zip.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

zip.form = zipForm;
