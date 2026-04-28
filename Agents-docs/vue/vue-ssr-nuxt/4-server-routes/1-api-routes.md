---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-api-routes"
---

# Créer des Routes API avec Nuxt (Backend Intégré !)

Nuxt inclut le moteur serveur **Nitro**, qui vous permet de créer des endpoints API directement dans votre projet frontend. Un seul projet, un seul déploiement !

## La Route API de Base

```typescript
// server/api/hello.ts
export default defineEventHandler(() => {
  return { message: "Bonjour depuis l'API !" };
});

// Accessible à : /api/hello
```

## Les Méthodes HTTP (Nomage de Fichiers)

```typescript
// server/api/users.get.ts - GET /api/users
export default defineEventHandler(() => {
  return [{ id: 1, name: "Alice" }];
});

// server/api/users.post.ts - POST /api/users
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // Créer l'utilisateur...
  return { id: 2, ...body };
});

// server/api/users/[id].delete.ts - DELETE /api/users/:id
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  // Supprimer l'utilisateur...
  return { deleted: id };
});
```

## Lire les Données de la Requête

```typescript
// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  // Corps de la requête
  const body = await readBody(event);

  // Paramètres de query (?page=1&limit=10)
  const query = getQuery(event);

  // Paramètres de route (/api/users/123)
  const id = getRouterParam(event, "id");

  // Headers
  const authHeader = getHeader(event, "authorization");

  // Cookies
  const token = getCookie(event, "auth-token");

  return { body, query, id };
});
```

## Les Routes Dynamiques

```typescript
// server/api/users/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  // Rechercher l'utilisateur par ID
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "Utilisateur introuvable",
    });
  }

  return user;
});
```

## La Gestion des Erreurs

```typescript
// server/api/users/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: "ID utilisateur invalide",
    });
  }

  const user = findUser(id);

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Introuvable",
      message: `Utilisateur ${id} introuvable`,
    });
  }

  return user;
});
```

## Gérer la Réponse

```typescript
export default defineEventHandler((event) => {
  // Définir le code de statut
  setResponseStatus(event, 201);

  // Définir des headers
  setHeader(event, "Content-Type", "application/json");
  setHeader(event, "Cache-Control", "max-age=3600");

  // Définir un cookie
  setCookie(event, "token", "abc123", {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24, // 1 jour
  });

  return { success: true };
});
```

## Le Middleware Serveur (Comme Un Gardien)

```typescript
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  // S'exécute à CHAQUE requête !
  const token = getHeader(event, "authorization");

  if (event.path.startsWith("/api/protected")) {
    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Non autorisé",
      });
    }
    // Attacher l'utilisateur au contexte (disponible dans toutes les routes)
    event.context.user = verifyToken(token);
  }
});
```

## Les Utilitaires Serveur

```typescript
// server/utils/db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };

// Auto-importé dans les routes serveur !
// server/api/users.ts
export default defineEventHandler(async () => {
  return await prisma.user.findMany();
});
```

## Exemple avec Base de Données (Prisma + CRUD)

```typescript
// server/api/posts/index.get.ts
export default defineEventHandler(async () => {
  return await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
});

// server/api/posts/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: event.context.user.id,
    },
  });

  return post;
});

// server/api/posts/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: body,
  });

  return post;
});
```

## Les Grimoires De Tests

- [Le Répertoire Serveur Nuxt (Guide Officiel)](https://nuxt.com/docs/guide/directory-structure/server)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
