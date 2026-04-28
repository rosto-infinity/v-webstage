---
source_course: "typescript-architecture"
source_lesson: "typescript-architecture-nominal-typing"
---

# Typage Nominal vs Structurel

TypeScript utilise un typage structurel : si ça ressemble à un canard, c'est un canard. `interface A { x: number }` est compatible avec `interface B { x: number }`.

Parfois, vous voulez un **Typage Nominal** (distinguer les types par leur nom) pour éviter de confondre des valeurs, comme `UserId` et `OrderId`.

## Branded Types (Types Marqués)

Nous pouvons simuler cela en utilisant le "branding" (une intersection avec un tag unique).

```typescript
type Brand<K, T> = K & { __brand: T };

type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;

function euroToUsd(euro: EUR): USD {
  return (euro * 1.1) as USD;
}

const myEur = 10 as EUR;
const myUsd = euroToUsd(myEur);
// euroToUsd(10); // Erreur : number n'est pas EUR
```

---

> 📘 _Cette leçon fait partie du cours [Architecture & Patterns TypeScript](/typescript/typescript-architecture/) sur la plateforme d'apprentissage RostoDev._
