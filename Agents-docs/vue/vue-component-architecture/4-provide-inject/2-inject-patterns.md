---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-provide-inject-patterns"
---

# Schémas Avancés de Provide/Inject

Explorons des schémas pratiques pour utiliser provide/inject dans des applications réelles.

## Schéma de Contexte d'Authentification

Partagez l'état d'authentification dans toute votre application :

```typescript
// src/composables/useAuth.ts
import { ref, computed, readonly } from "vue";
import type { InjectionKey, Ref } from "vue";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type AuthContext = {
  user: Readonly<Ref<User | null>>;
  isAuthenticated: Ref<boolean>;
  isAdmin: Ref<boolean>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthKey: InjectionKey<AuthContext> = Symbol("auth");

export function createAuthContext(): AuthContext {
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => user.value?.role === "admin");

  async function login(email: string, password: string) {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    user.value = await response.json();
  }

  function logout() {
    user.value = null;
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
}
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { provide } from "vue";
import { AuthKey, createAuthContext } from "@/composables/useAuth";

const auth = createAuthContext();
provide(AuthKey, auth);
</script>
```

```vue
<!-- N'importe quel composant -->
<script setup lang="ts">
import { inject } from "vue";
import { AuthKey } from "@/composables/useAuth";

const auth = inject(AuthKey)!;
</script>

<template>
  <div v-if="auth.isAuthenticated">
    Bienvenue, {{ auth.user?.name }}
    <button @click="auth.logout">Déconnexion</button>
  </div>
  <LoginForm v-else @login="auth.login" />
</template>
```

## Système de Notifications Toast

```typescript
// src/composables/useToast.ts
import { ref, readonly } from "vue";
import type { InjectionKey, Ref } from "vue";

export type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
};

export type ToastContext = {
  toasts: Readonly<Ref<Toast[]>>;
  show: (message: string, type?: Toast["type"], duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  dismiss: (id: number) => void;
};

export const ToastKey: InjectionKey<ToastContext> = Symbol("toast");

export function createToastContext(): ToastContext {
  const toasts = ref<Toast[]>([]);
  let nextId = 1;

  function show(
    message: string,
    type: Toast["type"] = "info",
    duration = 5000,
  ) {
    const id = nextId++;
    toasts.value.push({ id, message, type, duration });

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }

  function dismiss(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) toasts.value.splice(index, 1);
  }

  return {
    toasts: readonly(toasts),
    show,
    success: (msg) => show(msg, "success"),
    error: (msg) => show(msg, "error"),
    warning: (msg) => show(msg, "warning"),
    info: (msg) => show(msg, "info"),
    dismiss,
  };
}
```

```vue
<!-- ToastContainer.vue -->
<script setup lang="ts">
import { inject } from "vue";
import { ToastKey } from "@/composables/useToast";

const toast = inject(ToastKey)!;
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toast.toasts"
        :key="t.id"
        :class="['toast', t.type]"
        @click="toast.dismiss(t.id)"
      >
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
```

## Schéma de Contexte de Formulaire

Partagez l'état d'un formulaire avec des champs imbriqués :

```vue
<!-- FormProvider.vue -->
<script setup lang="ts">
import { provide, reactive, computed } from "vue";
import type { InjectionKey } from "vue";

type FormContext = {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string) => void;
  isValid: boolean;
};

export const FormKey: InjectionKey<FormContext> = Symbol("form");

const props = defineProps<{
  initialValues?: Record<string, any>;
}>();

const emit = defineEmits<{
  submit: [values: Record<string, any>];
}>();

const state = reactive({
  values: { ...props.initialValues },
  errors: {} as Record<string, string>,
  touched: {} as Record<string, boolean>,
});

const isValid = computed(() => Object.keys(state.errors).length === 0);

provide(FormKey, {
  values: state.values,
  errors: state.errors,
  touched: state.touched,
  setValue: (name, value) => {
    state.values[name] = value;
  },
  setError: (name, error) => {
    if (error) state.errors[name] = error;
    else delete state.errors[name];
  },
  setTouched: (name) => {
    state.touched[name] = true;
  },
  isValid: isValid.value,
});

function handleSubmit() {
  if (isValid.value) {
    emit("submit", state.values);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>
```

```vue
<!-- FormInput.vue -->
<script setup lang="ts">
import { inject, computed } from "vue";
import { FormKey } from "./FormProvider.vue";

const props = defineProps<{
  name: string;
  label: string;
  rules?: (value: any) => string | true;
}>();

const form = inject(FormKey)!;

const value = computed({
  get: () => form.values[props.name] || "",
  set: (val) => {
    form.setValue(props.name, val);
    validate(val);
  },
});

function validate(val: any) {
  if (props.rules) {
    const result = props.rules(val);
    form.setError(props.name, result === true ? "" : result);
  }
}

function handleBlur() {
  form.setTouched(props.name);
}
</script>

<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <input
      :id="name"
      v-model="value"
      @blur="handleBlur"
      :class="{ error: form.touched[name] && form.errors[name] }"
    />
    <span v-if="form.touched[name] && form.errors[name]" class="error-text">
      {{ form.errors[name] }}
    </span>
  </div>
</template>
```

```vue
<!-- Utilisation -->
<FormProvider
  :initial-values="{ email: '', password: '' }"
  @submit="handleSubmit"
>
  <FormInput 
    name="email" 
    label="Email"
    :rules="v => !v ? 'Requis' : true"
  />
  <FormInput 
    name="password" 
    label="Mot de passe"
    :rules="v => v.length < 8 ? '8 caractères minimum' : true"
  />
  <button type="submit">Soumettre</button>
</FormProvider>
```

## Ressources

- [Travailler avec la Réactivité](https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity) — Rendre provide/inject réactif

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
