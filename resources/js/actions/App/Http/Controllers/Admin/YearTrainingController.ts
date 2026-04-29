import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\YearTrainingController::index
* @see app/Http/Controllers/Admin/YearTrainingController.php:18
* @route '/year-trainings'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/year-trainings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::index
* @see app/Http/Controllers/Admin/YearTrainingController.php:18
* @route '/year-trainings'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::index
* @see app/Http/Controllers/Admin/YearTrainingController.php:18
* @route '/year-trainings'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::index
* @see app/Http/Controllers/Admin/YearTrainingController.php:18
* @route '/year-trainings'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::index
* @see app/Http/Controllers/Admin/YearTrainingController.php:18
* @route '/year-trainings'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::index
* @see app/Http/Controllers/Admin/YearTrainingController.php:18
* @route '/year-trainings'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::index
* @see app/Http/Controllers/Admin/YearTrainingController.php:18
* @route '/year-trainings'
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
* @see \App\Http\Controllers\Admin\YearTrainingController::create
* @see app/Http/Controllers/Admin/YearTrainingController.php:29
* @route '/year-trainings/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/year-trainings/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::create
* @see app/Http/Controllers/Admin/YearTrainingController.php:29
* @route '/year-trainings/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::create
* @see app/Http/Controllers/Admin/YearTrainingController.php:29
* @route '/year-trainings/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::create
* @see app/Http/Controllers/Admin/YearTrainingController.php:29
* @route '/year-trainings/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::create
* @see app/Http/Controllers/Admin/YearTrainingController.php:29
* @route '/year-trainings/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::create
* @see app/Http/Controllers/Admin/YearTrainingController.php:29
* @route '/year-trainings/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::create
* @see app/Http/Controllers/Admin/YearTrainingController.php:29
* @route '/year-trainings/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::store
* @see app/Http/Controllers/Admin/YearTrainingController.php:34
* @route '/year-trainings'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/year-trainings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::store
* @see app/Http/Controllers/Admin/YearTrainingController.php:34
* @route '/year-trainings'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::store
* @see app/Http/Controllers/Admin/YearTrainingController.php:34
* @route '/year-trainings'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::store
* @see app/Http/Controllers/Admin/YearTrainingController.php:34
* @route '/year-trainings'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::store
* @see app/Http/Controllers/Admin/YearTrainingController.php:34
* @route '/year-trainings'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::show
* @see app/Http/Controllers/Admin/YearTrainingController.php:0
* @route '/year-trainings/{year_training}'
*/
export const show = (args: { year_training: string | number } | [year_training: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/year-trainings/{year_training}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::show
* @see app/Http/Controllers/Admin/YearTrainingController.php:0
* @route '/year-trainings/{year_training}'
*/
show.url = (args: { year_training: string | number } | [year_training: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { year_training: args }
    }

    if (Array.isArray(args)) {
        args = {
            year_training: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        year_training: args.year_training,
    }

    return show.definition.url
            .replace('{year_training}', parsedArgs.year_training.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::show
* @see app/Http/Controllers/Admin/YearTrainingController.php:0
* @route '/year-trainings/{year_training}'
*/
show.get = (args: { year_training: string | number } | [year_training: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::show
* @see app/Http/Controllers/Admin/YearTrainingController.php:0
* @route '/year-trainings/{year_training}'
*/
show.head = (args: { year_training: string | number } | [year_training: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::show
* @see app/Http/Controllers/Admin/YearTrainingController.php:0
* @route '/year-trainings/{year_training}'
*/
const showForm = (args: { year_training: string | number } | [year_training: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::show
* @see app/Http/Controllers/Admin/YearTrainingController.php:0
* @route '/year-trainings/{year_training}'
*/
showForm.get = (args: { year_training: string | number } | [year_training: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::show
* @see app/Http/Controllers/Admin/YearTrainingController.php:0
* @route '/year-trainings/{year_training}'
*/
showForm.head = (args: { year_training: string | number } | [year_training: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::edit
* @see app/Http/Controllers/Admin/YearTrainingController.php:43
* @route '/year-trainings/{year_training}/edit'
*/
export const edit = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/year-trainings/{year_training}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::edit
* @see app/Http/Controllers/Admin/YearTrainingController.php:43
* @route '/year-trainings/{year_training}/edit'
*/
edit.url = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { year_training: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { year_training: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            year_training: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        year_training: typeof args.year_training === 'object'
        ? args.year_training.id
        : args.year_training,
    }

    return edit.definition.url
            .replace('{year_training}', parsedArgs.year_training.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::edit
* @see app/Http/Controllers/Admin/YearTrainingController.php:43
* @route '/year-trainings/{year_training}/edit'
*/
edit.get = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::edit
* @see app/Http/Controllers/Admin/YearTrainingController.php:43
* @route '/year-trainings/{year_training}/edit'
*/
edit.head = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::edit
* @see app/Http/Controllers/Admin/YearTrainingController.php:43
* @route '/year-trainings/{year_training}/edit'
*/
const editForm = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::edit
* @see app/Http/Controllers/Admin/YearTrainingController.php:43
* @route '/year-trainings/{year_training}/edit'
*/
editForm.get = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::edit
* @see app/Http/Controllers/Admin/YearTrainingController.php:43
* @route '/year-trainings/{year_training}/edit'
*/
editForm.head = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\YearTrainingController::update
* @see app/Http/Controllers/Admin/YearTrainingController.php:50
* @route '/year-trainings/{year_training}'
*/
export const update = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/year-trainings/{year_training}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::update
* @see app/Http/Controllers/Admin/YearTrainingController.php:50
* @route '/year-trainings/{year_training}'
*/
update.url = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { year_training: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { year_training: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            year_training: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        year_training: typeof args.year_training === 'object'
        ? args.year_training.id
        : args.year_training,
    }

    return update.definition.url
            .replace('{year_training}', parsedArgs.year_training.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::update
* @see app/Http/Controllers/Admin/YearTrainingController.php:50
* @route '/year-trainings/{year_training}'
*/
update.put = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::update
* @see app/Http/Controllers/Admin/YearTrainingController.php:50
* @route '/year-trainings/{year_training}'
*/
update.patch = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::update
* @see app/Http/Controllers/Admin/YearTrainingController.php:50
* @route '/year-trainings/{year_training}'
*/
const updateForm = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::update
* @see app/Http/Controllers/Admin/YearTrainingController.php:50
* @route '/year-trainings/{year_training}'
*/
updateForm.put = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::update
* @see app/Http/Controllers/Admin/YearTrainingController.php:50
* @route '/year-trainings/{year_training}'
*/
updateForm.patch = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\YearTrainingController::destroy
* @see app/Http/Controllers/Admin/YearTrainingController.php:59
* @route '/year-trainings/{year_training}'
*/
export const destroy = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/year-trainings/{year_training}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::destroy
* @see app/Http/Controllers/Admin/YearTrainingController.php:59
* @route '/year-trainings/{year_training}'
*/
destroy.url = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { year_training: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { year_training: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            year_training: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        year_training: typeof args.year_training === 'object'
        ? args.year_training.id
        : args.year_training,
    }

    return destroy.definition.url
            .replace('{year_training}', parsedArgs.year_training.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::destroy
* @see app/Http/Controllers/Admin/YearTrainingController.php:59
* @route '/year-trainings/{year_training}'
*/
destroy.delete = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::destroy
* @see app/Http/Controllers/Admin/YearTrainingController.php:59
* @route '/year-trainings/{year_training}'
*/
const destroyForm = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\YearTrainingController::destroy
* @see app/Http/Controllers/Admin/YearTrainingController.php:59
* @route '/year-trainings/{year_training}'
*/
destroyForm.delete = (args: { year_training: number | { id: number } } | [year_training: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const YearTrainingController = { index, create, store, show, edit, update, destroy }

export default YearTrainingController