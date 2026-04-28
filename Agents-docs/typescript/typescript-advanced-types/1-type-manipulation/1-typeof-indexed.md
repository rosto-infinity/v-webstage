---
source_course: "typescript-advanced-types"
source_lesson: "typescript-advanced-types-keyof-typeof-indexed"
---

# L'opérateur `keyof`

L'opérateur `keyof` prend un type d'objet et produit une union de littéraux de chaînes ou de nombres de ses clés.

```typescript
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"
```

# L'opérateur `typeof`

TypeScript vous permet d'utiliser `typeof` dans un contexte de type pour faire référence au _type_ d'une variable.

```typescript
const config = { width: 100, height: 200 };
type Config = typeof config; // { width: number; height: number }
```

# Types d'Accès Indexés

Vous pouvez utiliser `Type[Key]` pour rechercher le type d'une propriété spécifique.

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // number
```

### Ressources

- [Manuel TypeScript : Opérateur de type keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

---

> 📘 _Cette leçon fait partie du cours [Maîtrise du Système de Types TypeScript](/typescript/typescript-advanced-types/) sur la plateforme d'apprentissage RostoDev._
