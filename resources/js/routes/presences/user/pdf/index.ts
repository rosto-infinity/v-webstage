import { applyUrlDefaults, queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\PresenceController::period
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
export const period = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: period.url(args, options),
    method: 'get',
});

period.definition = {
    methods: ['get', 'head'],
    url: '/presences/users/{user}/pdf/{startDate}/{endDate}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::period
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
period.url = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            startDate: args[1],
            endDate: args[2],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        user: typeof args.user === 'object' ? args.user.id : args.user,
        startDate: args.startDate,
        endDate: args.endDate,
    };

    return (
        period.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{startDate}', parsedArgs.startDate.toString())
            .replace('{endDate}', parsedArgs.endDate.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::period
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
period.get = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: period.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::period
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
period.head = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: period.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::period
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
const periodForm = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: period.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::period
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
periodForm.get = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: period.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::period
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
periodForm.head = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: period.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

period.form = periodForm;

const pdf = {
    period: Object.assign(period, period),
};

export default pdf;
