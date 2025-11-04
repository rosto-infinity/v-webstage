import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:189
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
* @see app/Http/Controllers/Admin/PresenceController.php:189
* @route '/presences/excel'
*/
excel.url = (options?: RouteQueryOptions) => {
    return excel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:189
* @route '/presences/excel'
*/
excel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:189
* @route '/presences/excel'
*/
excel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: excel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:189
* @route '/presences/excel'
*/
const excelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:189
* @route '/presences/excel'
*/
excelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::excel
* @see app/Http/Controllers/Admin/PresenceController.php:189
* @route '/presences/excel'
*/
excelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

excel.form = excelForm

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:196
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
* @see app/Http/Controllers/Admin/PresenceController.php:196
* @route '/presences/download-all'
*/
downloadAll.url = (options?: RouteQueryOptions) => {
    return downloadAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:196
* @route '/presences/download-all'
*/
downloadAll.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAll.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:196
* @route '/presences/download-all'
*/
downloadAll.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAll.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:196
* @route '/presences/download-all'
*/
const downloadAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAll.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:196
* @route '/presences/download-all'
*/
downloadAllForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAll.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::downloadAll
* @see app/Http/Controllers/Admin/PresenceController.php:196
* @route '/presences/download-all'
*/
downloadAllForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAll.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadAll.form = downloadAllForm

/**
* @see \App\Http\Controllers\Admin\PresenceController::index
* @see app/Http/Controllers/Admin/PresenceController.php:28
* @route '/presences/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/presences/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::index
* @see app/Http/Controllers/Admin/PresenceController.php:28
* @route '/presences/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::index
* @see app/Http/Controllers/Admin/PresenceController.php:28
* @route '/presences/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::index
* @see app/Http/Controllers/Admin/PresenceController.php:28
* @route '/presences/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::index
* @see app/Http/Controllers/Admin/PresenceController.php:28
* @route '/presences/users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::index
* @see app/Http/Controllers/Admin/PresenceController.php:28
* @route '/presences/users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::index
* @see app/Http/Controllers/Admin/PresenceController.php:28
* @route '/presences/users'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:74
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
* @see app/Http/Controllers/Admin/PresenceController.php:74
* @route '/presences/add'
*/
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:74
* @route '/presences/add'
*/
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:74
* @route '/presences/add'
*/
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:74
* @route '/presences/add'
*/
const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: add.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:74
* @route '/presences/add'
*/
addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: add.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::add
* @see app/Http/Controllers/Admin/PresenceController.php:74
* @route '/presences/add'
*/
addForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: add.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

add.form = addForm

/**
* @see \App\Http\Controllers\Admin\PresenceController::store
* @see app/Http/Controllers/Admin/PresenceController.php:93
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
* @see app/Http/Controllers/Admin/PresenceController.php:93
* @route '/presences/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PresenceController::store
* @see app/Http/Controllers/Admin/PresenceController.php:93
* @route '/presences/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::store
* @see app/Http/Controllers/Admin/PresenceController.php:93
* @route '/presences/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::store
* @see app/Http/Controllers/Admin/PresenceController.php:93
* @route '/presences/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:128
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
* @see app/Http/Controllers/Admin/PresenceController.php:128
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
* @see app/Http/Controllers/Admin/PresenceController.php:128
* @route '/presences/{id}/edit'
*/
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:128
* @route '/presences/{id}/edit'
*/
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:128
* @route '/presences/{id}/edit'
*/
const editForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:128
* @route '/presences/{id}/edit'
*/
editForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::edit
* @see app/Http/Controllers/Admin/PresenceController.php:128
* @route '/presences/{id}/edit'
*/
editForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Admin\PresenceController::update
* @see app/Http/Controllers/Admin/PresenceController.php:155
* @route '/presences/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/presences/{id}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\PresenceController::update
* @see app/Http/Controllers/Admin/PresenceController.php:155
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
* @see app/Http/Controllers/Admin/PresenceController.php:155
* @route '/presences/{id}'
*/
update.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::update
* @see app/Http/Controllers/Admin/PresenceController.php:155
* @route '/presences/{id}'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::update
* @see app/Http/Controllers/Admin/PresenceController.php:155
* @route '/presences/{id}'
*/
updateForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\PresenceController::destroy
* @see app/Http/Controllers/Admin/PresenceController.php:178
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
* @see app/Http/Controllers/Admin/PresenceController.php:178
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
* @see app/Http/Controllers/Admin/PresenceController.php:178
* @route '/presences/{presence}'
*/
destroy.delete = (args: { presence: number | { id: number } } | [presence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::destroy
* @see app/Http/Controllers/Admin/PresenceController.php:178
* @route '/presences/{presence}'
*/
const destroyForm = (args: { presence: number | { id: number } } | [presence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PresenceController::destroy
* @see app/Http/Controllers/Admin/PresenceController.php:178
* @route '/presences/{presence}'
*/
destroyForm.delete = (args: { presence: number | { id: number } } | [presence: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const PresenceController = { excel, downloadAll, index, add, store, edit, update, destroy }

export default PresenceController