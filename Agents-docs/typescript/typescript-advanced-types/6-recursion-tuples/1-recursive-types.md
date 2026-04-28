---
source_course: "typescript-advanced-types"
source_lesson: "typescript-advanced-types-recursive-types"
---

# Types Récursifs

Les types TypeScript peuvent faire référence à eux-mêmes. C'est crucial pour définir des structures comme le JSON ou des Arbres.

```typescript
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
```

## Types de Tuples Variadiques

TypeScript 4.0 a introduit la possibilité de décomposer (spread) des tuples génériques.

```typescript
type Strings = [string, string];
type Numbers = [number, number];
type StrNum = [...Strings, ...Numbers]; // [string, string, number, number]

function concat<T extends unknown[], U extends unknown[]>(
  arr1: [...T],
  arr2: [...U],
): [...T, ...U] {
  return [...arr1, ...arr2];
}
```

### Ressources

- [Manuel TypeScript : Types de Tuples Variadiques](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

---

> 📘 _Cette leçon fait partie du cours [Maîtrise du Système de Types TypeScript](/typescript/typescript-advanced-types/) sur la plateforme d'apprentissage RostoDev._
