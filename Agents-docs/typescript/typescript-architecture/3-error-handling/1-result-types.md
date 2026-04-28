---
source_course: "typescript-architecture"
source_lesson: "typescript-architecture-result-types"
---

# Pattern Result

Au lieu de lever des erreurs (qui ne sont pas type-safe dans les signatures TS), de nombreux développeurs préfèrent retourner un objet `Result`.

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function parseUser(json: string): Result<User> {
  try {
    return { success: true, data: JSON.parse(json) };
  } catch (e) {
    return { success: false, error: e as Error };
  }
}
```

Cela oblige l'appelant à vérifier `success` avant d'accéder à `data` (via les Unions Discriminées).

---

> 📘 _Cette leçon fait partie du cours [Architecture & Patterns TypeScript](/typescript/typescript-architecture/) sur la plateforme d'apprentissage RostoDev._
