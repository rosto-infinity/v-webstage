---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-provide-inject-patterns"
---

# Design Patterns Avancés de Provide/Inject

Explorons des modèles d'architecture extrêmement sophistiqués pour utiliser efficacement `provide` et `inject` en production complexe.

## Le "Plugin Pattern" (Création de Plugin Global Vue 3)

Créez un véritable plugin global de framework qui installe et rend accessible de grands services d'injections à toute l'application :

```typescript
// toast-plugin.ts
import type { App, InjectionKey, Ref } from "vue";
import { ref } from "vue";

export type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

export type ToastService = {
  toasts: Ref<Toast[]>;
  show: (message: string, type?: Toast["type"]) => void;
  dismiss: (id: number) => void;
};

// 1. Déclarer la clé unique Typée de l'Injection Industrielle
export const toastKey: InjectionKey<ToastService> = Symbol("toast");

// 2. L'Installateur du Plugin Global !
export function createToastPlugin() {
  return {
    // La méthode 'install' native de Vue 3
    install(app: App) {
      const toasts = ref<Toast[]>([]);
      let id = 0;

      const service: ToastService = {
        toasts,
        show(message, type = "info") {
          const toast = { id: ++id, message, type };
          toasts.value.push(toast);
          setTimeout(() => service.dismiss(toast.id), 3000);
        },
        dismiss(id) {
          const index = toasts.value.findIndex((t) => t.id === id);
          if (index > -1) toasts.value.splice(index, 1);
        },
      };

      // On Fournit ce Super Service à L'ENSEMBLE racine gigantesque de toute l'App !
      app.provide(toastKey, service);
    },
  };
}

// 3. Le Composable Pratique d'Accès de facilité pour les futurs développeurs Front-End :
export function useToast() {
  const toast = inject(toastKey);
  // Sécurité Architecturale infranchissable : Crash si le dev a oublié d'appeler l'installateur dans son main.ts !
  if (!toast)
    throw new Error(
      "Le Plugin UI Toast est manquant (Non installé via app.use() dans main.ts !)",
    );
  return toast;
}
```

```typescript
// main.ts
import { createApp } from "vue";
import { createToastPlugin } from "./toast-plugin";

const app = createApp(App);

// ==== INSTALLATION OFFICIELLE ====
app.use(createToastPlugin());

app.mount("#app");
```

```vue
<!-- Utilisation : Dans N'IMPORTE QUEL micro composant Lointain UI de toute l'Application entière -->
<script setup>
import { useToast } from "./toast-plugin";

// Accès Instantané et Typé aux méthodes du plugin global injecté !
const { show } = useToast();

function handleSave() {
  show("Le Fichier Excel a bien été Sauvegardé !", "success");
}
</script>
```

## Le "Context Pattern" (Modèle Contexte)

Regroupez plutôt un groupe faramineux de "fournitures" disparates en un énorme "Contexte d'Etat Global" (State) super structuré, à la manière absolue de fonctionnement de React Context :

```typescript
// auth-context.ts
import type { InjectionKey, Ref } from "vue";
import { inject, provide, ref, computed } from "vue";

type User = { id: number; name: string; email: string };

// 1. La définition de Forme pure de notre Gros Contexte Partagé de données (Un contrat avec le TS)
type AuthContext = {
  user: Ref<User | null>;
  isLoggedIn: ComputedRef<boolean>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const authKey: InjectionKey<AuthContext> = Symbol("auth");

// ==== 2. LE GRAND FOURNISSEUR UNIQUE (Le Parent Maitre) ====
export function provideAuth() {
  const user = ref<User | null>(null);
  // Variable Dérivée
  const isLoggedIn = computed(() => !!user.value);

  async function login(credentials: { email: string; password: string }) {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    user.value = await response.json();
  }

  function logout() {
    user.value = null;
  }

  // On assemble le Gros pack de Données Contractuelles
  const context: AuthContext = {
    user,
    isLoggedIn,
    login,
    logout,
  };

  // On Diffuse tout ce conteneur massif sur les ondes aux Enfant !
  provide(authKey, context);

  return context;
}

// ==== 3. LE RECEVEUR (LE CONSUMER ACCESSEUR SOUS TERRAIN) ====
export function useAuth() {
  const auth = inject(authKey);
  if (!auth) {
    throw new Error(
      "Un appel useAuth() doit impérativement être appelé à l'intérieur architectural de la bonne descendance d'une route parent Fournissant les data (provideAuth)!",
    );
  }
  return auth;
}
```

```vue
<!-- Component Route Parent du dossier (Ex:  App.vue ou RouteAuth.vue) -->
<script setup>
import { provideAuth } from "./auth-context";

// BOUM. On allume tout le moteur distant pour toute sa descendance absolue d'enfants de router !
provideAuth();
</script>

<!-- N'importe quel profil super lointain type Enfant / Petit Enfant descendant -->
<script setup>
import { useAuth } from "./auth-context";

// Récupération Immédiate et Typé par l'IDE de notre grand lot complet (Variables Refs réactives magiques !!!)
const { user, isLoggedIn, logout } = useAuth();
</script>
```

## Le "Form Context Pattern" (Contexte Séparé de Formulaires Inclusif)

C'est LE meilleur UseCase absolu en entreprise pour Provide/Inject ! Quand un composant très complexe `<Form>` gère son `submit` mais encercle d'une infinité de micro sous-composants abstraits et isolés de Form (Genre `<MonInputMagique>` ou `<MessageAlerteErreur>`) qui sont de simples dossiers de composants `.vue` extérieurs :

```typescript
// form-context.ts
import type { InjectionKey } from "vue";

type FormContext = {
  disabled: Ref<boolean>;
  errors: Ref<Record<string, string>>;
  registerField: (name: string) => void;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
};

const formKey: InjectionKey<FormContext> = Symbol("form-magique");

export function provideForm() {
  const disabled = ref(false);
  const errors = ref<Record<string, string>>({});
  const fields = ref<string[]>([]);

  const context: FormContext = {
    disabled,
    errors,
    registerField(name) {
      fields.value.push(name);
    },
    setFieldError(name, error) {
      errors.value[name] = error;
    },
    clearFieldError(name) {
      delete errors.value[name];
    },
  };

  provide(formKey, context);
  return context;
}

export function useFormField(name: string) {
  const form = inject(formKey);
  if (!form) {
    throw new Error(
      "Fatal : useFormField ne peut pas vivre tout seul dehors, mais toujours confiné dans une grande balise <FormParent> !",
    );
  }

  // Le Super Pouvoir Absolu: Le Petit Enfant Composant lointain s'enregistre et O-TO-MA-TI-QUE-MENT déclare magiquement sa propre existence au composant du Grand Form Papa lointain dés son render !!
  form.registerField(name);

  const error = computed(() => form.errors.value[name]);
  const hasError = computed(() => !!error.value);

  return {
    disabled: form.disabled,
    error,
    hasError,
    // Des méthodes pures passées au gosse
    setError: (msg: string) => form.setFieldError(name, msg),
    clearError: () => form.clearFieldError(name),
  };
}
```

## Les Fournisseurs Imbriqués Extrêmes (Surcharge Parentale / Overriding Localisé)

Le Provide/Inject a une règle d'ascendance fascinante sur la lecture des variables : Le Petit Enfant scannera toujours son code HTML et l'arbre Component Vue vers le HAUT jusqu'à lire impérativement la toute Première balise `Provide` de Papa **LE PLUS PROCHE hiérarchiquement de LUI**, quitte à volontairement ignorer et _écraser_ (surcharger) l'historique et lointain Provide original mondial !

```vue
<!-- MonComposantFiltre: ThemeProvider.vue -->
<script setup>
import { provide } from 'vue'

const props = defineProps<{ theme: 'light' | 'dark' }>()

provide('theme', props.theme)
</script>

<template>
  <slot />
</template>

<!-- === UTILISATION D'ECASEMENT DE FORCE ABSOLUE (OVERRIDING) === -->
<template>
  <!-- Le Main Root Parent Provide Sombre -->
  <ThemeProvider theme="dark">
    <!-- Absolument TOUTE INTERFACE ici dedans tournera en Thème pur "Dark" de manière naturelle par l'Injection par ondes lointaines!... -->

    <!-- BOUM. Nouveau Composant Injecteur. Dans ce nouveau sous cercle isolé, on SURCHARGE brutalement l'ancien Provide lointain avec une toute MAJ d'onde Provide très locale ! -->
    <ThemeProvider theme="light">
      <!-- Cette pure Card indépendante Injectera Magiquement 'light', parce qu'elle écoute prioritairement le Parent Fournisseur LE PLUS PROCHE d'elle et Ignore TOTALEMENT l'existence de Dark le lointain Ancien ! -->
      <Card />
    </ThemeProvider>
  </ThemeProvider>
</template>
```

## Ressources Complémentaires de Pointe

- [L'Injection de Dépendance d'Expert dans Vue 3](https://vuejs.org/api/composition-api-dependency-injection.html) — La Référence API experte et de point pour des détails complets sur les limites de provide/inject.

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
