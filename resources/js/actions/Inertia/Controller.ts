import { queryParams, type RouteDefinition, type RouteFormDefinition, type RouteQueryOptions } from './../../wayfinder';
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/conditions-stage'
 */
const Controller1561154fcc94e101fba986e094f14ff9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller1561154fcc94e101fba986e094f14ff9.url(options),
    method: 'get',
});

Controller1561154fcc94e101fba986e094f14ff9.definition = {
    methods: ['get', 'head'],
    url: '/conditions-stage',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/conditions-stage'
 */
Controller1561154fcc94e101fba986e094f14ff9.url = (options?: RouteQueryOptions) => {
    return Controller1561154fcc94e101fba986e094f14ff9.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/conditions-stage'
 */
Controller1561154fcc94e101fba986e094f14ff9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller1561154fcc94e101fba986e094f14ff9.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/conditions-stage'
 */
Controller1561154fcc94e101fba986e094f14ff9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller1561154fcc94e101fba986e094f14ff9.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/conditions-stage'
 */
const Controller1561154fcc94e101fba986e094f14ff9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller1561154fcc94e101fba986e094f14ff9.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/conditions-stage'
 */
Controller1561154fcc94e101fba986e094f14ff9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller1561154fcc94e101fba986e094f14ff9.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/conditions-stage'
 */
Controller1561154fcc94e101fba986e094f14ff9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller1561154fcc94e101fba986e094f14ff9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

Controller1561154fcc94e101fba986e094f14ff9.form = Controller1561154fcc94e101fba986e094f14ff9Form;
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
const Controller535fd093ca1d5254af5dc12ac208e8d5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
});

Controller535fd093ca1d5254af5dc12ac208e8d5.definition = {
    methods: ['get', 'head'],
    url: '/about',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5.url = (options?: RouteQueryOptions) => {
    return Controller535fd093ca1d5254af5dc12ac208e8d5.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
const Controller535fd093ca1d5254af5dc12ac208e8d5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller535fd093ca1d5254af5dc12ac208e8d5.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/about'
 */
Controller535fd093ca1d5254af5dc12ac208e8d5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller535fd093ca1d5254af5dc12ac208e8d5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

Controller535fd093ca1d5254af5dc12ac208e8d5.form = Controller535fd093ca1d5254af5dc12ac208e8d5Form;
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
const Controllere9f8ddead315a755d63e476058ea35f0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere9f8ddead315a755d63e476058ea35f0.url(options),
    method: 'get',
});

Controllere9f8ddead315a755d63e476058ea35f0.definition = {
    methods: ['get', 'head'],
    url: '/guide-stage',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
Controllere9f8ddead315a755d63e476058ea35f0.url = (options?: RouteQueryOptions) => {
    return Controllere9f8ddead315a755d63e476058ea35f0.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
Controllere9f8ddead315a755d63e476058ea35f0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere9f8ddead315a755d63e476058ea35f0.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
Controllere9f8ddead315a755d63e476058ea35f0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere9f8ddead315a755d63e476058ea35f0.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
const Controllere9f8ddead315a755d63e476058ea35f0Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere9f8ddead315a755d63e476058ea35f0.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
Controllere9f8ddead315a755d63e476058ea35f0Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere9f8ddead315a755d63e476058ea35f0.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/guide-stage'
 */
Controllere9f8ddead315a755d63e476058ea35f0Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere9f8ddead315a755d63e476058ea35f0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

Controllere9f8ddead315a755d63e476058ea35f0.form = Controllere9f8ddead315a755d63e476058ea35f0Form;
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dev-app'
 */
const Controllerd304968035a0ccaab9947efaa98a73df = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerd304968035a0ccaab9947efaa98a73df.url(options),
    method: 'get',
});

Controllerd304968035a0ccaab9947efaa98a73df.definition = {
    methods: ['get', 'head'],
    url: '/dev-app',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dev-app'
 */
Controllerd304968035a0ccaab9947efaa98a73df.url = (options?: RouteQueryOptions) => {
    return Controllerd304968035a0ccaab9947efaa98a73df.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dev-app'
 */
Controllerd304968035a0ccaab9947efaa98a73df.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerd304968035a0ccaab9947efaa98a73df.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dev-app'
 */
Controllerd304968035a0ccaab9947efaa98a73df.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerd304968035a0ccaab9947efaa98a73df.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dev-app'
 */
const Controllerd304968035a0ccaab9947efaa98a73dfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd304968035a0ccaab9947efaa98a73df.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dev-app'
 */
Controllerd304968035a0ccaab9947efaa98a73dfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd304968035a0ccaab9947efaa98a73df.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dev-app'
 */
Controllerd304968035a0ccaab9947efaa98a73dfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd304968035a0ccaab9947efaa98a73df.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

Controllerd304968035a0ccaab9947efaa98a73df.form = Controllerd304968035a0ccaab9947efaa98a73dfForm;
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
const Controller8fe52b875955a022a9bccb3e0f174b81 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8fe52b875955a022a9bccb3e0f174b81.url(options),
    method: 'get',
});

Controller8fe52b875955a022a9bccb3e0f174b81.definition = {
    methods: ['get', 'head'],
    url: '/genie-logiciel',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
Controller8fe52b875955a022a9bccb3e0f174b81.url = (options?: RouteQueryOptions) => {
    return Controller8fe52b875955a022a9bccb3e0f174b81.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
Controller8fe52b875955a022a9bccb3e0f174b81.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8fe52b875955a022a9bccb3e0f174b81.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
Controller8fe52b875955a022a9bccb3e0f174b81.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller8fe52b875955a022a9bccb3e0f174b81.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
const Controller8fe52b875955a022a9bccb3e0f174b81Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8fe52b875955a022a9bccb3e0f174b81.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
Controller8fe52b875955a022a9bccb3e0f174b81Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8fe52b875955a022a9bccb3e0f174b81.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/genie-logiciel'
 */
Controller8fe52b875955a022a9bccb3e0f174b81Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8fe52b875955a022a9bccb3e0f174b81.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

Controller8fe52b875955a022a9bccb3e0f174b81.form = Controller8fe52b875955a022a9bccb3e0f174b81Form;
/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
const Controller92f1f176050b935721bc0098427f55ed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'get',
});

Controller92f1f176050b935721bc0098427f55ed.definition = {
    methods: ['get', 'head'],
    url: '/faq',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55ed.url = (options?: RouteQueryOptions) => {
    return Controller92f1f176050b935721bc0098427f55ed.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55ed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55ed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
const Controller92f1f176050b935721bc0098427f55edForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55edForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller92f1f176050b935721bc0098427f55ed.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/faq'
 */
Controller92f1f176050b935721bc0098427f55edForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller92f1f176050b935721bc0098427f55ed.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

Controller92f1f176050b935721bc0098427f55ed.form = Controller92f1f176050b935721bc0098427f55edForm;

const Controller = {
    '/conditions-stage': Controller1561154fcc94e101fba986e094f14ff9,
    '/about': Controller535fd093ca1d5254af5dc12ac208e8d5,
    '/guide-stage': Controllere9f8ddead315a755d63e476058ea35f0,
    '/dev-app': Controllerd304968035a0ccaab9947efaa98a73df,
    '/genie-logiciel': Controller8fe52b875955a022a9bccb3e0f174b81,
    '/faq': Controller92f1f176050b935721bc0098427f55ed,
};

export default Controller;
