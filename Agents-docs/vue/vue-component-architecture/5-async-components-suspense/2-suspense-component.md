---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-suspense-component"
---

# Gérer l'Asynchrone avec Suspense

`<Suspense>` est un composant intégré qui gère les dépendances asynchrones dans l'arbre de composants, en affichant un contenu de repli pendant l'attente.

## Utilisation de Base de Suspense

```vue
<template>
  <Suspense>
    <!-- Composant avec un setup asynchrone -->
    <template #default>
      <AsyncComponent />
    </template>

    <!-- Affiché pendant le chargement -->
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
```

## Setup Asynchrone dans les Composants

Les composants avec des opérations asynchrones dans `<script setup>` déclenchent Suspense :

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
// L'await de premier niveau rend ce composant asynchrone
const response = await fetch("/api/user");
const user = await response.json();
</script>

<template>
  <div class="profile">
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
  </div>
</template>
```

```vue
<!-- Parent -->
<template>
  <Suspense>
    <UserProfile />
    <template #fallback>
      <p>Chargement du profil...</p>
    </template>
  </Suspense>
</template>
```

## Dépendances Asynchrones Multiples

Suspense attend que TOUTES les dépendances asynchrones soient résolues :

```vue
<template>
  <Suspense>
    <template #default>
      <div class="dashboard">
        <UserStats />
        <!-- asynchrone -->
        <RecentActivity />
        <!-- asynchrone -->
        <Notifications />
        <!-- asynchrone -->
      </div>
    </template>

    <template #fallback>
      <DashboardSkeleton />
    </template>
  </Suspense>
</template>
```

## Gestion des Erreurs avec onErrorCaptured

```vue
<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
  error.value = err;
  return false; // Empêcher la propagation
});
</script>

<template>
  <div v-if="error" class="error">
    <p>Une erreur est survenue : {{ error.message }}</p>
    <button @click="error = null">Réessayer</button>
  </div>

  <Suspense v-else>
    <AsyncContent />
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
```

## Événements de Suspense

Écoutez les changements d'état de Suspense :

```vue
<script setup>
function onPending() {
  console.log("Chargement démarré");
}

function onResolve() {
  console.log("Chargement terminé");
}

function onFallback() {
  console.log("Le repli est maintenant affiché");
}
</script>

<template>
  <Suspense @pending="onPending" @resolve="onResolve" @fallback="onFallback">
    <AsyncComponent />
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
```

## Suspense Imbriqué

Gérez différents états de chargement de façon indépendante :

```vue
<template>
  <!-- Suspense externe pour la mise en page -->
  <Suspense>
    <template #default>
      <AsyncLayout>
        <!-- Suspense interne pour le contenu -->
        <Suspense>
          <template #default>
            <AsyncContent />
          </template>
          <template #fallback>
            <ContentSkeleton />
          </template>
        </Suspense>
      </AsyncLayout>
    </template>
    <template #fallback>
      <FullPageLoader />
    </template>
  </Suspense>
</template>
```

## Exemple Pratique : Page de Récupération de Données

```vue
<!-- PostPage.vue -->
<script setup lang="ts">
import { ref, onErrorCaptured, Suspense } from "vue";

const error = ref<Error | null>(null);
const key = ref(0);

onErrorCaptured((err) => {
  error.value = err;
  return false;
});

function retry() {
  error.value = null;
  key.value++; // Forcer le re-montage
}
</script>

<template>
  <div class="post-page">
    <div v-if="error" class="error-state">
      <h2>Échec du chargement</h2>
      <p>{{ error.message }}</p>
      <button @click="retry">Réessayer</button>
    </div>

    <Suspense v-else :key="key">
      <template #default>
        <PostContent />
        <CommentSection />
        <RelatedPosts />
      </template>

      <template #fallback>
        <div class="loading-state">
          <PostSkeleton />
          <CommentsSkeleton />
        </div>
      </template>
    </Suspense>
  </div>
</template>
```

```vue
<!-- PostContent.vue -->
<script setup lang="ts">
const props = defineProps<{ postId: string }>();

// Cet await déclenche Suspense dans le parent
const response = await fetch(`/api/posts/${props.postId}`);
if (!response.ok) throw new Error("Impossible de charger l'article");
const post = await response.json();
</script>

<template>
  <article>
    <h1>{{ post.title }}</h1>
    <div v-html="post.content"></div>
  </article>
</template>
```

## Notes Importantes

1. **Fonctionnalité Expérimentale** : Suspense est encore expérimental dans Vue 3
2. **Support SSR** : Fonctionne avec le rendu côté serveur
3. **Keep-Alive** : Compatible avec `<KeepAlive>` pour la mise en cache
4. **Transition** : Le contenu Suspense peut être enveloppé avec `<Transition>`

## Ressources

- [Suspense](https://vuejs.org/guide/built-ins/suspense.html) — Documentation officielle Vue sur Suspense

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
