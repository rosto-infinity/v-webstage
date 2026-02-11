import { applyUrlDefaults, queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\UserController::index
 * @see app/Http/Controllers/Admin/UserController.php:89
 * @route '/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/dashboard',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::index
 * @see app/Http/Controllers/Admin/UserController.php:89
 * @route '/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::index
 * @see app/Http/Controllers/Admin/UserController.php:89
 * @route '/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::index
 * @see app/Http/Controllers/Admin/UserController.php:89
 * @route '/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::index
 * @see app/Http/Controllers/Admin/UserController.php:89
 * @route '/dashboard'
 */
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::index
 * @see app/Http/Controllers/Admin/UserController.php:89
 * @route '/dashboard'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::index
 * @see app/Http/Controllers/Admin/UserController.php:89
 * @route '/dashboard'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;

/**
 * @see \App\Http\Controllers\Admin\UserController::list
 * @see app/Http/Controllers/Admin/UserController.php:50
 * @route '/dashboard/presence-list-user'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
});

list.definition = {
    methods: ['get', 'head'],
    url: '/dashboard/presence-list-user',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::list
 * @see app/Http/Controllers/Admin/UserController.php:50
 * @route '/dashboard/presence-list-user'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::list
 * @see app/Http/Controllers/Admin/UserController.php:50
 * @route '/dashboard/presence-list-user'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::list
 * @see app/Http/Controllers/Admin/UserController.php:50
 * @route '/dashboard/presence-list-user'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::list
 * @see app/Http/Controllers/Admin/UserController.php:50
 * @route '/dashboard/presence-list-user'
 */
const listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::list
 * @see app/Http/Controllers/Admin/UserController.php:50
 * @route '/dashboard/presence-list-user'
 */
listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::list
 * @see app/Http/Controllers/Admin/UserController.php:50
 * @route '/dashboard/presence-list-user'
 */
listForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

list.form = listForm;

/**
 * @see \App\Http\Controllers\Admin\UserController::downloadAllUser
 * @see app/Http/Controllers/Admin/UserController.php:220
 * @route '/dashboard/downloadpdf-presence'
 */
export const downloadAllUser = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllUser.url(options),
    method: 'get',
});

downloadAllUser.definition = {
    methods: ['get', 'head'],
    url: '/dashboard/downloadpdf-presence',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::downloadAllUser
 * @see app/Http/Controllers/Admin/UserController.php:220
 * @route '/dashboard/downloadpdf-presence'
 */
downloadAllUser.url = (options?: RouteQueryOptions) => {
    return downloadAllUser.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::downloadAllUser
 * @see app/Http/Controllers/Admin/UserController.php:220
 * @route '/dashboard/downloadpdf-presence'
 */
downloadAllUser.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllUser.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::downloadAllUser
 * @see app/Http/Controllers/Admin/UserController.php:220
 * @route '/dashboard/downloadpdf-presence'
 */
downloadAllUser.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAllUser.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::downloadAllUser
 * @see app/Http/Controllers/Admin/UserController.php:220
 * @route '/dashboard/downloadpdf-presence'
 */
const downloadAllUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAllUser.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::downloadAllUser
 * @see app/Http/Controllers/Admin/UserController.php:220
 * @route '/dashboard/downloadpdf-presence'
 */
downloadAllUserForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAllUser.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::downloadAllUser
 * @see app/Http/Controllers/Admin/UserController.php:220
 * @route '/dashboard/downloadpdf-presence'
 */
downloadAllUserForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAllUser.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadAllUser.form = downloadAllUserForm;

/**
 * @see \App\Http\Controllers\Admin\UserController::indexlist
 * @see app/Http/Controllers/Admin/UserController.php:34
 * @route '/gestions/users'
 */
export const indexlist = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexlist.url(options),
    method: 'get',
});

indexlist.definition = {
    methods: ['get', 'head'],
    url: '/gestions/users',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::indexlist
 * @see app/Http/Controllers/Admin/UserController.php:34
 * @route '/gestions/users'
 */
indexlist.url = (options?: RouteQueryOptions) => {
    return indexlist.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::indexlist
 * @see app/Http/Controllers/Admin/UserController.php:34
 * @route '/gestions/users'
 */
indexlist.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexlist.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::indexlist
 * @see app/Http/Controllers/Admin/UserController.php:34
 * @route '/gestions/users'
 */
indexlist.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexlist.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::indexlist
 * @see app/Http/Controllers/Admin/UserController.php:34
 * @route '/gestions/users'
 */
const indexlistForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexlist.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::indexlist
 * @see app/Http/Controllers/Admin/UserController.php:34
 * @route '/gestions/users'
 */
indexlistForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexlist.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::indexlist
 * @see app/Http/Controllers/Admin/UserController.php:34
 * @route '/gestions/users'
 */
indexlistForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexlist.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

indexlist.form = indexlistForm;

/**
 * @see \App\Http\Controllers\Admin\UserController::create
 * @see app/Http/Controllers/Admin/UserController.php:151
 * @route '/gestions/users/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/gestions/users/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::create
 * @see app/Http/Controllers/Admin/UserController.php:151
 * @route '/gestions/users/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::create
 * @see app/Http/Controllers/Admin/UserController.php:151
 * @route '/gestions/users/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::create
 * @see app/Http/Controllers/Admin/UserController.php:151
 * @route '/gestions/users/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::create
 * @see app/Http/Controllers/Admin/UserController.php:151
 * @route '/gestions/users/create'
 */
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::create
 * @see app/Http/Controllers/Admin/UserController.php:151
 * @route '/gestions/users/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::create
 * @see app/Http/Controllers/Admin/UserController.php:151
 * @route '/gestions/users/create'
 */
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

create.form = createForm;

/**
 * @see \App\Http\Controllers\Admin\UserController::store
 * @see app/Http/Controllers/Admin/UserController.php:161
 * @route '/gestions/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/gestions/users',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::store
 * @see app/Http/Controllers/Admin/UserController.php:161
 * @route '/gestions/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::store
 * @see app/Http/Controllers/Admin/UserController.php:161
 * @route '/gestions/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::store
 * @see app/Http/Controllers/Admin/UserController.php:161
 * @route '/gestions/users'
 */
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::store
 * @see app/Http/Controllers/Admin/UserController.php:161
 * @route '/gestions/users'
 */
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Admin\UserController::edit
 * @see app/Http/Controllers/Admin/UserController.php:179
 * @route '/gestions/users/{user}/edit'
 */
export const edit = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/gestions/users/{user}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::edit
 * @see app/Http/Controllers/Admin/UserController.php:179
 * @route '/gestions/users/{user}/edit'
 */
edit.url = (args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        user: typeof args.user === 'object' ? args.user.id : args.user,
    };

    return edit.definition.url.replace('{user}', parsedArgs.user.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::edit
 * @see app/Http/Controllers/Admin/UserController.php:179
 * @route '/gestions/users/{user}/edit'
 */
edit.get = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::edit
 * @see app/Http/Controllers/Admin/UserController.php:179
 * @route '/gestions/users/{user}/edit'
 */
edit.head = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::edit
 * @see app/Http/Controllers/Admin/UserController.php:179
 * @route '/gestions/users/{user}/edit'
 */
const editForm = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::edit
 * @see app/Http/Controllers/Admin/UserController.php:179
 * @route '/gestions/users/{user}/edit'
 */
editForm.get = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::edit
 * @see app/Http/Controllers/Admin/UserController.php:179
 * @route '/gestions/users/{user}/edit'
 */
editForm.head = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

edit.form = editForm;

/**
 * @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:192
 * @route '/gestions/users/{user}'
 */
export const update = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/gestions/users/{user}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:192
 * @route '/gestions/users/{user}'
 */
update.url = (args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        user: typeof args.user === 'object' ? args.user.id : args.user,
    };

    return update.definition.url.replace('{user}', parsedArgs.user.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:192
 * @route '/gestions/users/{user}'
 */
update.put = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:192
 * @route '/gestions/users/{user}'
 */
const updateForm = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
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
 * @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:192
 * @route '/gestions/users/{user}'
 */
updateForm.put = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
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
 * @see \App\Http\Controllers\Admin\UserController::destroy
 * @see app/Http/Controllers/Admin/UserController.php:213
 * @route '/gestions/users/{user}'
 */
export const destroy = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/gestions/users/{user}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\UserController::destroy
 * @see app/Http/Controllers/Admin/UserController.php:213
 * @route '/gestions/users/{user}'
 */
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        user: typeof args.user === 'object' ? args.user.id : args.user,
    };

    return destroy.definition.url.replace('{user}', parsedArgs.user.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\UserController::destroy
 * @see app/Http/Controllers/Admin/UserController.php:213
 * @route '/gestions/users/{user}'
 */
destroy.delete = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\UserController::destroy
 * @see app/Http/Controllers/Admin/UserController.php:213
 * @route '/gestions/users/{user}'
 */
const destroyForm = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
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
 * @see \App\Http\Controllers\Admin\UserController::destroy
 * @see app/Http/Controllers/Admin/UserController.php:213
 * @route '/gestions/users/{user}'
 */
destroyForm.delete = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
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

const UserController = { index, list, downloadAllUser, indexlist, create, store, edit, update, destroy };

export default UserController;
