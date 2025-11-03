import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SocialMediaController::index
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::index
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::index
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::index
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::store
* @see app/Http/Controllers/Settings/SocialMediaController.php:22
* @route '/settings/media'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::store
* @see app/Http/Controllers/Settings/SocialMediaController.php:22
* @route '/settings/media'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::store
* @see app/Http/Controllers/Settings/SocialMediaController.php:22
* @route '/settings/media'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::update
* @see app/Http/Controllers/Settings/SocialMediaController.php:71
* @route '/settings/media/{socialMedia}'
*/
export const update = (args: { socialMedia: number | { id: number } } | [socialMedia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/media/{socialMedia}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::update
* @see app/Http/Controllers/Settings/SocialMediaController.php:71
* @route '/settings/media/{socialMedia}'
*/
update.url = (args: { socialMedia: number | { id: number } } | [socialMedia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { socialMedia: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { socialMedia: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            socialMedia: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        socialMedia: typeof args.socialMedia === 'object'
        ? args.socialMedia.id
        : args.socialMedia,
    }

    return update.definition.url
            .replace('{socialMedia}', parsedArgs.socialMedia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::update
* @see app/Http/Controllers/Settings/SocialMediaController.php:71
* @route '/settings/media/{socialMedia}'
*/
update.put = (args: { socialMedia: number | { id: number } } | [socialMedia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::destroy
* @see app/Http/Controllers/Settings/SocialMediaController.php:117
* @route '/settings/media/{socialMedia}'
*/
export const destroy = (args: { socialMedia: number | { id: number } } | [socialMedia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/media/{socialMedia}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::destroy
* @see app/Http/Controllers/Settings/SocialMediaController.php:117
* @route '/settings/media/{socialMedia}'
*/
destroy.url = (args: { socialMedia: number | { id: number } } | [socialMedia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { socialMedia: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { socialMedia: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            socialMedia: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        socialMedia: typeof args.socialMedia === 'object'
        ? args.socialMedia.id
        : args.socialMedia,
    }

    return destroy.definition.url
            .replace('{socialMedia}', parsedArgs.socialMedia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::destroy
* @see app/Http/Controllers/Settings/SocialMediaController.php:117
* @route '/settings/media/{socialMedia}'
*/
destroy.delete = (args: { socialMedia: number | { id: number } } | [socialMedia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const SocialMediaController = { index, store, update, destroy }

export default SocialMediaController