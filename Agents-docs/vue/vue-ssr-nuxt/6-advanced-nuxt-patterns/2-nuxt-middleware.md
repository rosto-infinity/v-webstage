---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-middleware"
---

# Les Middleware de Route (Les Gardiens de Porte)

Les middleware s'exécutent avant la navigation vers une route. Parfaits pour l'authentification et la protection des pages.

## Créer un Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    // Redirige vers la page de connexion
    return navigateTo("/login");
  }
});
```

## Utiliser un Middleware

### Par Page

```vue
<script setup>
definePageMeta({
  middleware: "auth", // Nom du fichier sans .ts
});
</script>
```

### Plusieurs Middleware

```vue
<script setup>
definePageMeta({
  middleware: ["auth", "admin"], // Exécutés dans l'ordre
});
</script>
```

### Middleware Global (Toutes les Routes)

```typescript
// middleware/analytics.global.ts  ← Le .global le rend universel !
export default defineNuxtRouteMiddleware((to) => {
  // S'exécute à chaque changement de route
  trackPageView(to.fullPath);
});
```

## Exemple d'Authentification

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { status, data } = useAuth();

  // Laisser passer si déjà sur la page de login
  if (to.path === "/login") return;

  // Rediriger vers le login si non authentifié
  if (status.value !== "authenticated") {
    return navigateTo("/login", {
      replace: true,
    });
  }
});

// middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  const { data } = useAuth();

  if (data.value?.role !== "admin") {
    // Lancer une erreur 403
    throw createError({
      statusCode: 403,
      message: "Accès interdit",
    });
  }
});
```

## Middleware Inline (Dans la Page Directement)

```vue
<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      // Logique inline personnalisée
      if (to.params.id === "0") {
        return abortNavigation("ID invalide");
      }
    },
  ],
});
</script>
```

## Les Résultats de Navigation

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  // Laisser passer (par défaut)
  return;

  // Rediriger
  return navigateTo("/autre-page");

  // Rediriger avec options
  return navigateTo("/login", {
    replace: true,
    redirectCode: 301, // Redirection permanente
  });

  // Redirection externe
  return navigateTo("https://nuxt.com", {
    external: true,
  });

  // Annuler avec message
  return abortNavigation("Accès refusé");

  // Annuler avec objet d'erreur
  return abortNavigation(
    createError({ statusCode: 404, message: "Introuvable" }),
  );
});
```

## Middleware Asynchrone

```typescript
// middleware/subscription.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Peut faire des appels API !
  const { data: subscription } = await useFetch("/api/subscription");

  if (!subscription.value?.active) {
    return navigateTo("/subscribe");
  }
});
```

## Les Grimoires De Tests

- [Les Middleware de Route Nuxt (Guide Officiel)](https://nuxt.com/docs/guide/directory-structure/middleware)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
