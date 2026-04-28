---
source_course: "typescript-architecture"
source_lesson: "typescript-architecture-abstract-classes-mixins"
---

# Classes Abstraites

Les classes abstraites sont des classes de base qui ne peuvent pas être instanciées directement. Elles peuvent contenir des détails d'implémentation pour leurs membres.

```typescript
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log("en train d'errer sur terre...");
  }
}
```

## Mixins

TypeScript modélise les mixins comme des fonctions qui acceptent un constructeur de classe et retournent une nouvelle classe l'étendant.

```typescript
type Constructor = new (...args: any[]) => {};

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}
```

---

> 📘 _Cette leçon fait partie du cours [Architecture & Patterns TypeScript](/typescript/typescript-architecture/) sur la plateforme d'apprentissage RostoDev._
