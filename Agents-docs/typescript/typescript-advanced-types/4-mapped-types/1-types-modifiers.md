---
source_course: "typescript-advanced-types"
source_lesson: "typescript-advanced-types-mapped-types-modifiers"
---

# Mapped Types

Les mapped types vous permettent de créer de nouveaux types en itérant sur les clés d'un type existant.

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

## Modificateurs de Mappage

Vous pouvez ajouter ou supprimer les modificateurs `readonly` et `?` en utilisant `+` (par défaut) ou `-`.

```typescript
// Supprime les attributs 'readonly' des propriétés d'un type
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

// Supprime les attributs optionnels (les rend obligatoires)
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
```

## Remappage de Clés

Vous pouvez changer le nom de la clé en utilisant `as`.

```typescript
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};
```

---

> 📘 _Cette leçon fait partie du cours [Maîtrise du Système de Types TypeScript](/typescript/typescript-advanced-types/) sur la plateforme d'apprentissage RostoDev._
