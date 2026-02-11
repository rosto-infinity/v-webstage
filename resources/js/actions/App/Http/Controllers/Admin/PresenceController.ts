import { applyUrlDefaults, queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\PresenceController::excel
 * @see app/Http/Controllers/Admin/PresenceController.php:193
 * @route '/presences/excel'
 */
export const excel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
});

excel.definition = {
    methods: ['get', 'head'],
    url: '/presences/excel',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::excel
 * @see app/Http/Controllers/Admin/PresenceController.php:193
 * @route '/presences/excel'
 */
excel.url = (options?: RouteQueryOptions) => {
    return excel.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::excel
 * @see app/Http/Controllers/Admin/PresenceController.php:193
 * @route '/presences/excel'
 */
excel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::excel
 * @see app/Http/Controllers/Admin/PresenceController.php:193
 * @route '/presences/excel'
 */
excel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: excel.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::excel
 * @see app/Http/Controllers/Admin/PresenceController.php:193
 * @route '/presences/excel'
 */
const excelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::excel
 * @see app/Http/Controllers/Admin/PresenceController.php:193
 * @route '/presences/excel'
 */
excelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::excel
 * @see app/Http/Controllers/Admin/PresenceController.php:193
 * @route '/presences/excel'
 */
excelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

excel.form = excelForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAll
 * @see app/Http/Controllers/Admin/PresenceController.php:203
 * @route '/presences/download-all'
 */
export const downloadAll = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAll.url(options),
    method: 'get',
});

downloadAll.definition = {
    methods: ['get', 'head'],
    url: '/presences/download-all',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAll
 * @see app/Http/Controllers/Admin/PresenceController.php:203
 * @route '/presences/download-all'
 */
downloadAll.url = (options?: RouteQueryOptions) => {
    return downloadAll.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAll
 * @see app/Http/Controllers/Admin/PresenceController.php:203
 * @route '/presences/download-all'
 */
downloadAll.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAll.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAll
 * @see app/Http/Controllers/Admin/PresenceController.php:203
 * @route '/presences/download-all'
 */
downloadAll.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAll.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAll
 * @see app/Http/Controllers/Admin/PresenceController.php:203
 * @route '/presences/download-all'
 */
const downloadAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAll.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAll
 * @see app/Http/Controllers/Admin/PresenceController.php:203
 * @route '/presences/download-all'
 */
downloadAllForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAll.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAll
 * @see app/Http/Controllers/Admin/PresenceController.php:203
 * @route '/presences/download-all'
 */
downloadAllForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAll.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadAll.form = downloadAllForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:223
 * @route '/presences/users/{user}/pdf'
 */
export const downloadUserPdf = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadUserPdf.url(args, options),
    method: 'get',
});

downloadUserPdf.definition = {
    methods: ['get', 'head'],
    url: '/presences/users/{user}/pdf',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:223
 * @route '/presences/users/{user}/pdf'
 */
downloadUserPdf.url = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
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

    return downloadUserPdf.definition.url.replace('{user}', parsedArgs.user.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:223
 * @route '/presences/users/{user}/pdf'
 */
downloadUserPdf.get = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadUserPdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:223
 * @route '/presences/users/{user}/pdf'
 */
downloadUserPdf.head = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadUserPdf.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:223
 * @route '/presences/users/{user}/pdf'
 */
const downloadUserPdfForm = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadUserPdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:223
 * @route '/presences/users/{user}/pdf'
 */
downloadUserPdfForm.get = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadUserPdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:223
 * @route '/presences/users/{user}/pdf'
 */
downloadUserPdfForm.head = (
    args: { user: number | { id: number } } | [user: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadUserPdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadUserPdf.form = downloadUserPdfForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdfPeriod
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
export const downloadUserPdfPeriod = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadUserPdfPeriod.url(args, options),
    method: 'get',
});

downloadUserPdfPeriod.definition = {
    methods: ['get', 'head'],
    url: '/presences/users/{user}/pdf/{startDate}/{endDate}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdfPeriod
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
downloadUserPdfPeriod.url = (
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
        downloadUserPdfPeriod.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{startDate}', parsedArgs.startDate.toString())
            .replace('{endDate}', parsedArgs.endDate.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdfPeriod
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
downloadUserPdfPeriod.get = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadUserPdfPeriod.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdfPeriod
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
downloadUserPdfPeriod.head = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadUserPdfPeriod.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdfPeriod
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
const downloadUserPdfPeriodForm = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadUserPdfPeriod.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdfPeriod
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
downloadUserPdfPeriodForm.get = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadUserPdfPeriod.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadUserPdfPeriod
 * @see app/Http/Controllers/Admin/PresenceController.php:248
 * @route '/presences/users/{user}/pdf/{startDate}/{endDate}'
 */
downloadUserPdfPeriodForm.head = (
    args:
        | { user: number | { id: number }; startDate: string | number; endDate: string | number }
        | [user: number | { id: number }, startDate: string | number, endDate: string | number],
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadUserPdfPeriod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadUserPdfPeriod.form = downloadUserPdfPeriodForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAllUsersPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
export const downloadAllUsersPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllUsersPdf.url(options),
    method: 'get',
});

downloadAllUsersPdf.definition = {
    methods: ['get', 'head'],
    url: '/presences/users/pdf/all-zip',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAllUsersPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
downloadAllUsersPdf.url = (options?: RouteQueryOptions) => {
    return downloadAllUsersPdf.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAllUsersPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
downloadAllUsersPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAllUsersPdf.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAllUsersPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
downloadAllUsersPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAllUsersPdf.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAllUsersPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
const downloadAllUsersPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAllUsersPdf.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAllUsersPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
downloadAllUsersPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAllUsersPdf.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::downloadAllUsersPdf
 * @see app/Http/Controllers/Admin/PresenceController.php:274
 * @route '/presences/users/pdf/all-zip'
 */
downloadAllUsersPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAllUsersPdf.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadAllUsersPdf.form = downloadAllUsersPdfForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::index
 * @see app/Http/Controllers/Admin/PresenceController.php:31
 * @route '/presences/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/presences/users',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::index
 * @see app/Http/Controllers/Admin/PresenceController.php:31
 * @route '/presences/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::index
 * @see app/Http/Controllers/Admin/PresenceController.php:31
 * @route '/presences/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::index
 * @see app/Http/Controllers/Admin/PresenceController.php:31
 * @route '/presences/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::index
 * @see app/Http/Controllers/Admin/PresenceController.php:31
 * @route '/presences/users'
 */
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::index
 * @see app/Http/Controllers/Admin/PresenceController.php:31
 * @route '/presences/users'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::index
 * @see app/Http/Controllers/Admin/PresenceController.php:31
 * @route '/presences/users'
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
 * @see \App\Http\Controllers\Admin\PresenceController::add
 * @see app/Http/Controllers/Admin/PresenceController.php:78
 * @route '/presences/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
});

add.definition = {
    methods: ['get', 'head'],
    url: '/presences/add',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::add
 * @see app/Http/Controllers/Admin/PresenceController.php:78
 * @route '/presences/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::add
 * @see app/Http/Controllers/Admin/PresenceController.php:78
 * @route '/presences/add'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::add
 * @see app/Http/Controllers/Admin/PresenceController.php:78
 * @route '/presences/add'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::add
 * @see app/Http/Controllers/Admin/PresenceController.php:78
 * @route '/presences/add'
 */
const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: add.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::add
 * @see app/Http/Controllers/Admin/PresenceController.php:78
 * @route '/presences/add'
 */
addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: add.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::add
 * @see app/Http/Controllers/Admin/PresenceController.php:78
 * @route '/presences/add'
 */
addForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: add.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

add.form = addForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::store
 * @see app/Http/Controllers/Admin/PresenceController.php:97
 * @route '/presences/store'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/presences/store',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::store
 * @see app/Http/Controllers/Admin/PresenceController.php:97
 * @route '/presences/store'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::store
 * @see app/Http/Controllers/Admin/PresenceController.php:97
 * @route '/presences/store'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::store
 * @see app/Http/Controllers/Admin/PresenceController.php:97
 * @route '/presences/store'
 */
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::store
 * @see app/Http/Controllers/Admin/PresenceController.php:97
 * @route '/presences/store'
 */
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::edit
 * @see app/Http/Controllers/Admin/PresenceController.php:132
 * @route '/presences/{id}/edit'
 */
export const edit = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/presences/{id}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::edit
 * @see app/Http/Controllers/Admin/PresenceController.php:132
 * @route '/presences/{id}/edit'
 */
edit.url = (args: { id: string | number } | [id: string | number] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args };
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        id: args.id,
    };

    return edit.definition.url.replace('{id}', parsedArgs.id.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::edit
 * @see app/Http/Controllers/Admin/PresenceController.php:132
 * @route '/presences/{id}/edit'
 */
edit.get = (args: { id: string | number } | [id: string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::edit
 * @see app/Http/Controllers/Admin/PresenceController.php:132
 * @route '/presences/{id}/edit'
 */
edit.head = (args: { id: string | number } | [id: string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::edit
 * @see app/Http/Controllers/Admin/PresenceController.php:132
 * @route '/presences/{id}/edit'
 */
const editForm = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::edit
 * @see app/Http/Controllers/Admin/PresenceController.php:132
 * @route '/presences/{id}/edit'
 */
editForm.get = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::edit
 * @see app/Http/Controllers/Admin/PresenceController.php:132
 * @route '/presences/{id}/edit'
 */
editForm.head = (
    args: { id: string | number } | [id: string | number] | string | number,
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
 * @see \App\Http\Controllers\Admin\PresenceController::update
 * @see app/Http/Controllers/Admin/PresenceController.php:159
 * @route '/presences/{id}'
 */
export const update = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

update.definition = {
    methods: ['patch'],
    url: '/presences/{id}',
} satisfies RouteDefinition<['patch']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::update
 * @see app/Http/Controllers/Admin/PresenceController.php:159
 * @route '/presences/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args };
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        id: args.id,
    };

    return update.definition.url.replace('{id}', parsedArgs.id.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::update
 * @see app/Http/Controllers/Admin/PresenceController.php:159
 * @route '/presences/{id}'
 */
update.patch = (args: { id: string | number } | [id: string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::update
 * @see app/Http/Controllers/Admin/PresenceController.php:159
 * @route '/presences/{id}'
 */
const updateForm = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::update
 * @see app/Http/Controllers/Admin/PresenceController.php:159
 * @route '/presences/{id}'
 */
updateForm.patch = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::destroy
 * @see app/Http/Controllers/Admin/PresenceController.php:182
 * @route '/presences/{presence}'
 */
export const destroy = (
    args: { presence: number | { id: number } } | [presence: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/presences/{presence}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\PresenceController::destroy
 * @see app/Http/Controllers/Admin/PresenceController.php:182
 * @route '/presences/{presence}'
 */
destroy.url = (
    args: { presence: number | { id: number } } | [presence: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { presence: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { presence: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            presence: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        presence: typeof args.presence === 'object' ? args.presence.id : args.presence,
    };

    return destroy.definition.url.replace('{presence}', parsedArgs.presence.toString()).replace(/\/+$/, '') + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\PresenceController::destroy
 * @see app/Http/Controllers/Admin/PresenceController.php:182
 * @route '/presences/{presence}'
 */
destroy.delete = (
    args: { presence: number | { id: number } } | [presence: number | { id: number }] | number | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\PresenceController::destroy
 * @see app/Http/Controllers/Admin/PresenceController.php:182
 * @route '/presences/{presence}'
 */
const destroyForm = (
    args: { presence: number | { id: number } } | [presence: number | { id: number }] | number | { id: number },
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
 * @see \App\Http\Controllers\Admin\PresenceController::destroy
 * @see app/Http/Controllers/Admin/PresenceController.php:182
 * @route '/presences/{presence}'
 */
destroyForm.delete = (
    args: { presence: number | { id: number } } | [presence: number | { id: number }] | number | { id: number },
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

const PresenceController = {
    excel,
    downloadAll,
    downloadUserPdf,
    downloadUserPdfPeriod,
    downloadAllUsersPdf,
    index,
    add,
    store,
    edit,
    update,
    destroy,
};

export default PresenceController;
