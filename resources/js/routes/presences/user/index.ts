import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import pdf81d01d from './pdf'
/**
* @see \App\Http\Controllers\Admin\PresenceController::pdf
* @see app/Http/Controllers/Admin/PresenceController.php:223
* @route '/presences/users/{user}/pdf'
*/
export const pdf = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/presences/users/{user}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::pdf
* @see app/Http/Controllers/Admin/PresenceController.php:223
* @route '/presences/users/{user}/pdf'
*/
pdf.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return pdf.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::pdf
* @see app/Http/Controllers/Admin/PresenceController.php:223
* @route '/presences/users/{user}/pdf'
*/
pdf.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::pdf
* @see app/Http/Controllers/Admin/PresenceController.php:223
* @route '/presences/users/{user}/pdf'
*/
pdf.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::pdf
* @see app/Http/Controllers/Admin/PresenceController.php:223
* @route '/presences/users/{user}/pdf'
*/
const pdfForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::pdf
* @see app/Http/Controllers/Admin/PresenceController.php:223
* @route '/presences/users/{user}/pdf'
*/
pdfForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::pdf
* @see app/Http/Controllers/Admin/PresenceController.php:223
* @route '/presences/users/{user}/pdf'
*/
pdfForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pdf.form = pdfForm

const user = {
    pdf: Object.assign(pdf, pdf81d01d),
}

export default user