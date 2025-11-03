import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:134
* @route '/presences/excel'
*/
export const excel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
})

excel.definition = {
    methods: ["get","head"],
    url: '/presences/excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:134
* @route '/presences/excel'
*/
excel.url = (options?: RouteQueryOptions) => {
    return excel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:134
* @route '/presences/excel'
*/
excel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:134
* @route '/presences/excel'
*/
excel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: excel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:143
* @route '/presences/download-all'
*/
export const downloadAll = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAll.url(options),
    method: 'get',
})

downloadAll.definition = {
    methods: ["get","head"],
    url: '/presences/download-all',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:143
* @route '/presences/download-all'
*/
downloadAll.url = (options?: RouteQueryOptions) => {
    return downloadAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:143
* @route '/presences/download-all'
*/
downloadAll.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAll.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:143
* @route '/presences/download-all'
*/
downloadAll.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAll.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:52
* @route '/presences/add'
*/
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/presences/add',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:52
* @route '/presences/add'
*/
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:52
* @route '/presences/add'
*/
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:52
* @route '/presences/add'
*/
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::store
* @see app/Http/Controllers/Admin/PresenceController.php:60
* @route '/presences/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/presences/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::store
* @see app/Http/Controllers/Admin/PresenceController.php:60
* @route '/presences/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::store
* @see app/Http/Controllers/Admin/PresenceController.php:60
* @route '/presences/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:89
* @route '/presences/{id}/edit'
*/
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/presences/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:89
* @route '/presences/{id}/edit'
*/
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:89
* @route '/presences/{id}/edit'
*/
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:89
* @route '/presences/{id}/edit'
*/
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::update
* @see app/Http/Controllers/Admin/PresenceController.php:103
* @route '/presences/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/presences/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::update
* @see app/Http/Controllers/Admin/PresenceController.php:103
* @route '/presences/{id}'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::update
* @see app/Http/Controllers/Admin/PresenceController.php:103
* @route '/presences/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::destroy
* @see app/Http/Controllers/Admin/PresenceController.php:125
* @route '/presences/{presence}'
*/
export const destroy = (args: { presence: number | { id: number } } | [presence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/presences/{presence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::destroy
* @see app/Http/Controllers/Admin/PresenceController.php:125
* @route '/presences/{presence}'
*/
destroy.url = (args: { presence: number | { id: number } } | [presence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { presence: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { presence: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            presence: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        presence: typeof args.presence === 'object'
        ? args.presence.id
        : args.presence,
    }

    return destroy.definition.url
            .replace('{presence}', parsedArgs.presence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::destroy
* @see app/Http/Controllers/Admin/PresenceController.php:125
* @route '/presences/{presence}'
*/
destroy.delete = (args: { presence: number | { id: number } } | [presence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const presences = {
    add: Object.assign(add, add),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default presences