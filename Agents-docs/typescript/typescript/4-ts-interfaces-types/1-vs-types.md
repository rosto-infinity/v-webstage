---
source_course: "typescript"
source_lesson: "typescript-interfaces-vs-types"
---

# Alias de Type

Les alias de type vous permettent de nommer n'importe quel type, y compris les primitives, les unions et les intersections.

```typescript
type ID = string | number;
type Point = {
  x: number;
  y: number;
};
```

# Interfaces

Les interfaces servent exclusivement à définir la structure d'objets.

```typescript
interface Point {
  x: number;
  y: number;
}
```

## Extension

Les interfaces utilisent `extends` :

```typescript
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}
```

Les types utilisent l'intersection `&` :

```typescript
type Animal = { name: string };
type Bear = Animal & { honey: boolean };
```

## Recommandation

Utilisez les **Interfaces** pour définir la forme des objets (comme les API, modèles de BDD, props) car elles prennent en charge la fusion de déclarations et offrent des messages d'erreur plus clairs. Utilisez les **Types** pour les unions, primitives, tuples et transformations complexes.

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
