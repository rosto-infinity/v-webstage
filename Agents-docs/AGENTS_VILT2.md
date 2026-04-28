# Règles de Développement - Stack VILT

**Stack Technique :** Vue 3 + Inertia.js v2.3 + Laravel 12 + Tailwind CSS + Wayfinder

**Date :** Février 2026  
**Projet :** Event Style - Module CRM Clients

---

## 1. Structure du Projet

```
eventstylentertainment.com/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/           # Controllers Super Admin uniquement
│   │   │   └── CRM/             # NOUVEAU: Controllers CRM
│   │   │       ├── DashboardController.php
│   │   │       ├── ClientController.php
│   │   │       ├── EvenementController.php
│   │   │       └── RelanceController.php
│   │   ├── Middleware/
│   │   ├── Requests/CRM/        # Form Requests
│   │   └── Resources/CRM/       # API Resources
│   ├── Models/CRM/              # Models CRM
│   ├── Policies/CRM/            # Authorization Policies
│   └── Providers/
├── database/
│   ├── migrations/CRM/
│   └── seeders/
├── resources/js/
│   ├── pages/CRM/               # Pages Vue CRM
│   ├── components/crm/          # Composants CRM
│   ├── composables/             # Logique réutilisable
│   └── types/                   # Types TypeScript
└── routes/crm.php               # Routes CRM
```

---

## 2. Wayfinder - Routes Type-safe

### Commandes de base

```bash
# Generer les routes TypeScript
php artisan wayfinder:generate

# Mode watch pendant le dev
php artisan wayfinder:generate --watch
```

### Utilisation correcte

**❌ INCORRECT :**

```vue
<script setup>
router.delete(`/crm/clients/${id}`); // Pas de type safety
</script>
```

**✅ CORRECT :**

```vue
<script setup lang="ts">
import { destroy } from '@/routes/crm/clients';
router.delete(destroy(client.id));
</script>
```

### Convention de nommage routes

```php
Route::prefix('crm')->name('crm.')->group(function () {
    Route::get('clients', [ClientController::class, 'index'])
        ->name('clients.index');
    Route::resource('evenements', EvenementController::class)
        ->names('evenements');
});
```

---

## 3. Controllers - Patterns Inertia.js

**✅ Structure recommandée :**

```php
<?php
declare(strict_types=1);

namespace App\Http\Controllers\CRM;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Client::class, 'client');
    }

    public function index(Request $request): Response
    {
        $clients = Client::query()
            ->where('business_owner_id', $request->user()->id)
            ->when($request->search, fn ($q, $search) =>
                $q->where('nom', 'like', "%{$search}%")
            )
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('CRM/Clients/Index', [
            'clients' => ClientResource::collection($clients),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $client = Client::create($request->validated());

        return redirect()
            ->route('crm.clients.show', $client)
            ->with('success', 'Client cree avec succes.');
    }
}
```

---

## 4. Form Requests

```php
<?php
declare(strict_types=1);

namespace App\Http\Requests\CRM;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Client::class);
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'unique:clients'],
            'source' => ['required', 'in:facebook,instagram,site_web'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Securite : forcer l'association
        $this->merge([
            'business_owner_id' => $this->user()->id,
        ]);
    }
}
```

---

## 5. Vue.js 3 - Composants Inertia

```vue
<!-- Index.vue -->
<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { index as clientsIndex } from '@/routes/crm/clients';

interface Client {
    id: number;
    nom: string;
    telephone: string;
    email: string;
}

const props = defineProps<{
    clients: { data: Client[]; links: any };
    filters: { search?: string };
}>();

const search = ref(props.filters.search ?? '');

watch(
    search,
    debounce((value) => {
        router.get(
            clientsIndex(),
            { search: value || undefined },
            { preserveState: true, preserveScroll: true },
        );
    }, 300),
);
</script>

<template>
    <Head title="Mes Clients" />

    <AppLayout>
        <input v-model="search" placeholder="Rechercher..." />

        <table>
            <tr v-for="client in clients.data" :key="client.id">
                <td>{{ client.nom }}</td>
                <td>{{ client.email }}</td>
            </tr>
        </table>

        <Pagination :links="clients.links" />
    </AppLayout>
</template>
```

---

## 6. Gestion des Permissions cote Vue

### Composant Can.vue

```vue
<!-- components/Can.vue -->
<script setup>
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

const props = defineProps({
    permission: String,
    role: String,
});

const page = usePage();

const hasAccess = computed(() => {
    if (props.permission) {
        return page.props.auth.user.permissions?.includes(props.permission);
    }
    if (props.role) {
        return page.props.auth.user.roles?.includes(props.role);
    }
    return false;
});
</script>

<template>
    <slot v-if="hasAccess" />
</template>
```

### Utilisation

```vue
<template>
    <Can permission="manage-clients">
        <button @click="editClient">Modifier</button>
    </Can>

    <Can role="super-admin">
        <button @click="deleteClient">Supprimer</button>
    </Can>
</template>
```

---

## 7. Models avec Relations

```php
<?php
declare(strict_types=1);

namespace App\Models\CRM;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends Model
{
    protected $fillable = [
        'business_owner_id',
        'nom',
        'entreprise',
        'telephone',
        'email',
        'source',
    ];

    public const SOURCES = [
        'facebook' => 'Facebook',
        'instagram' => 'Instagram',
        'bouche_a_oreille' => 'Bouche a oreille',
        'site_web' => 'Site Web',
        'partenaire' => 'Partenaire',
    ];

    public function businessOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'business_owner_id');
    }

    public function evenements(): HasMany
    {
        return $this->hasMany(Evenement::class);
    }

    public function getSourceLabelAttribute(): string
    {
        return self::SOURCES[$this->source] ?? $this->source;
    }
}
```

---

## 8. Policies

```php
<?php
declare(strict_types=1);

namespace App\Policies\CRM;

use App\Models\User;
use App\Models\CRM\Client;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage-clients');
    }

    public function view(User $user, Client $client): bool
    {
        return $user->id === $client->business_owner_id
            || $user->hasRole('super-admin');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-clients');
    }

    public function update(User $user, Client $client): bool
    {
        return $user->id === $client->business_owner_id;
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->id === $client->business_owner_id;
    }
}
```

---

## 9. Regles de Securite

1. **Toujours utiliser Form Request** pour valider les donnees
2. **Toujours scoper les requetes** par `business_owner_id`
3. **Toujours utiliser Policies** pour l'autorisation
4. **Jamais de `Client::all()`** - toujours paginer ou filtrer
5. **Jamais confier l'ID** de l'utilisateur au frontend - utiliser `auth()->id()`

---

## 10. Commandes utiles

```bash
# Generer tout le module CRM
php artisan make:model CRM/Client -mfsc
php artisan make:model CRM/Evenement -mfsc
php artisan make:model CRM/Relance -mfsc

php artisan make:controller CRM/ClientController --resource
php artisan make:controller CRM/EvenementController --resource

php artisan make:request CRM/StoreClientRequest
php artisan make:request CRM/UpdateClientRequest

php artisan make:resource CRM/ClientResource
php artisan make:resource CRM/EvenementResource

php artisan make:policy CRM/ClientPolicy --model=Client
php artisan make:policy CRM/EvenementPolicy --model=Evenement

php artisan wayfinder:generate
npm run dev
```
