---
source_course: "typescript-advanced-types"
source_lesson: "typescript-advanced-types-pick-omit-partial"
---

# Types Utilitaires Intégrés

TypeScript fournit plusieurs types utilitaires pour faciliter les transformations de types courantes.

## Partial<Type>

Construit un type avec toutes les propriétés de `Type` définies comme optionnelles.

```typescript
interface Todo { title: string; description: string; }
function updateTodo(todo: Todo, fields: Partial<Todo>) { ... }
```

## Pick<Type, Keys>

Construit un type en choisissant l'ensemble des propriétés `Keys` dans `Type`.

```typescript
type TodoPreview = Pick<Todo, "title">;
```

## Omit<Type, Keys>

Construit un type en choisissant toutes les propriétés de `Type` puis en supprimant `Keys`.

```typescript
type TodoPreview = Omit<Todo, "description">;
```

## Record<Keys, Type>

Construit un type d'objet dont les clés de propriété sont `Keys` et dont les valeurs de propriété sont `Type`.

```typescript
const nav: Record<string, string> = { about: "/about", contact: "/contact" };
```

### Ressources

- [Manuel TypeScript : Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

> 📘 _Cette leçon fait partie du cours [Maîtrise du Système de Types TypeScript](/typescript/typescript-advanced-types/) sur la plateforme d'apprentissage RostoDev._
