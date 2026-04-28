---
source_course: "typescript-architecture"
source_lesson: "typescript-architecture-readonly-immutability"
---

# Immuabilité

TypeScript fournit des outils pour imposer l'immuabilité au moment de la compilation.

## Tableaux et Tuples en Lecture Seule (Readonly)

```typescript
const list: readonly number[] = [1, 2, 3];
// list.push(4); // Erreur
```

## Assertions Const (Const Assertions)

L'outil le plus puissant est `as const`.

```typescript
const config = {
  endpoint: "https://api.example.com",
  retries: 3,
} as const;

// Le type est :
// {
//   readonly endpoint: "https://api.example.com";
//   readonly retries: 3;
// }
```

Il rend tout `readonly` et affine les littéraux à leurs valeurs spécifiques.

---

> 📘 _Cette leçon fait partie du cours [Architecture & Patterns TypeScript](/typescript/typescript-architecture/) sur la plateforme d'apprentissage RostoDev._
