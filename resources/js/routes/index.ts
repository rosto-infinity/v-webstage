import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../wayfinder'
/**
* @see \App\Http\Controllers\HomeController::home
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HomeController::home
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HomeController::home
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HomeController::home
* @see app/Http/Controllers/HomeController.php:17
* @route '/'
*/
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

about.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
about.url = (options?: RouteQueryOptions) => {
    return about.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
about.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/about'
*/
about.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: about.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/faq'
*/
export const faq = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faq.url(options),
    method: 'get',
})

faq.definition = {
    methods: ["get","head"],
    url: '/faq',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/faq'
*/
faq.url = (options?: RouteQueryOptions) => {
    return faq.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/faq'
*/
faq.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faq.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/faq'
*/
faq.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: faq.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserController::dashboard
* @see app/Http/Controllers/Admin/UserController.php:67
* @route '/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::dashboard
* @see app/Http/Controllers/Admin/UserController.php:67
* @route '/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::dashboard
* @see app/Http/Controllers/Admin/UserController.php:67
* @route '/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::dashboard
* @see app/Http/Controllers/Admin/UserController.php:67
* @route '/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserController::list
* @see app/Http/Controllers/Admin/UserController.php:35
* @route '/dashboard/presence-list-user'
*/
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/dashboard/presence-list-user',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::list
* @see app/Http/Controllers/Admin/UserController.php:35
* @route '/dashboard/presence-list-user'
*/
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::list
* @see app/Http/Controllers/Admin/UserController.php:35
* @route '/dashboard/presence-list-user'
*/
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::list
* @see app/Http/Controllers/Admin/UserController.php:35
* @route '/dashboard/presence-list-user'
*/
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::presences
* @see app/Http/Controllers/Admin/PresenceController.php:19
* @route '/presences/users'
*/
export const presences = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: presences.url(options),
    method: 'get',
})

presences.definition = {
    methods: ["get","head"],
    url: '/presences/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::presences
* @see app/Http/Controllers/Admin/PresenceController.php:19
* @route '/presences/users'
*/
presences.url = (options?: RouteQueryOptions) => {
    return presences.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::presences
* @see app/Http/Controllers/Admin/PresenceController.php:19
* @route '/presences/users'
*/
presences.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: presences.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::presences
* @see app/Http/Controllers/Admin/PresenceController.php:19
* @route '/presences/users'
*/
presences.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: presences.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::media
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
export const media = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: media.url(options),
    method: 'get',
})

media.definition = {
    methods: ["get","head"],
    url: '/settings/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::media
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
media.url = (options?: RouteQueryOptions) => {
    return media.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::media
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
media.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: media.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\SocialMediaController::media
* @see app/Http/Controllers/Settings/SocialMediaController.php:15
* @route '/settings/media'
*/
media.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: media.url(options),
    method: 'head',
})

/**
* @see routes/settings.php:27
* @route '/settings/appearance'
*/
export const appearance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appearance.url(options),
    method: 'get',
})

appearance.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/settings.php:27
* @route '/settings/appearance'
*/
appearance.url = (options?: RouteQueryOptions) => {
    return appearance.definition.url + queryParams(options)
}

/**
* @see routes/settings.php:27
* @route '/settings/appearance'
*/
appearance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appearance.url(options),
    method: 'get',
})

/**
* @see routes/settings.php:27
* @route '/settings/appearance'
*/
appearance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: appearance.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::dbbackup
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
export const dbbackup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dbbackup.url(options),
    method: 'get',
})

dbbackup.definition = {
    methods: ["get","head"],
    url: '/settings/dbbackup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\DBBackupController::dbbackup
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
dbbackup.url = (options?: RouteQueryOptions) => {
    return dbbackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DBBackupController::dbbackup
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
dbbackup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dbbackup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DBBackupController::dbbackup
* @see app/Http/Controllers/Settings/DBBackupController.php:20
* @route '/settings/dbbackup'
*/
dbbackup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dbbackup.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see app/Http/Controllers/Auth/RegisteredUserController.php:23
* @route '/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see app/Http/Controllers/Auth/RegisteredUserController.php:23
* @route '/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see app/Http/Controllers/Auth/RegisteredUserController.php:23
* @route '/register'
*/
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
* @see app/Http/Controllers/Auth/RegisteredUserController.php:23
* @route '/register'
*/
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:21
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:21
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:21
* @route '/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
* @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:21
* @route '/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
* @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:44
* @route '/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
* @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:44
* @route '/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
* @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:44
* @route '/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see routes/web.php:69
* @route '/{any}'
*/
export const notfound = (args: { any: string | number } | [any: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notfound.url(args, options),
    method: 'get',
})

notfound.definition = {
    methods: ["get","head"],
    url: '/{any}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:69
* @route '/{any}'
*/
notfound.url = (args: { any: string | number } | [any: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { any: args }
    }

    if (Array.isArray(args)) {
        args = {
            any: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        any: args.any,
    }

    return notfound.definition.url
            .replace('{any}', parsedArgs.any.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see routes/web.php:69
* @route '/{any}'
*/
notfound.get = (args: { any: string | number } | [any: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notfound.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:69
* @route '/{any}'
*/
notfound.head = (args: { any: string | number } | [any: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notfound.url(args, options),
    method: 'head',
})

