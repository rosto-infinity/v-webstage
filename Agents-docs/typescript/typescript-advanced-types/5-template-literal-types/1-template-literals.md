---
source_course: "typescript-advanced-types"
source_lesson: "typescript-advanced-types-template-literals"
---

# Types de Littéraux de Gabarits

Les types de littéraux de gabarits partagent la même syntaxe que les gabarits de chaînes JavaScript (template strings), mais sont utilisés dans des positions de type.

```typescript
type World = "world";
type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

## Unions de Chaînes

Ils se distribuent sur les unions, ce qui permet de générer de nombreuses combinaisons.

```typescript
type Color = "red" | "blue";
type Quantity = "light" | "dark";
type Palette = `${Quantity}-${Color}`;
// "light-red" | "light-blue" | "dark-red" | "dark-blue"
```

## Manipulation Intrinsèque de Chaînes

TypeScript fournit des aides : `Uppercase<T>`, `Lowercase<T>`, `Capitalize<T>`, `Uncapitalize<T>`.

```typescript
type Shouty = Uppercase<"hello">; // "HELLO"
```

---

> 📘 _Cette leçon fait partie du cours [Maîtrise du Système de Types TypeScript](/typescript/typescript-advanced-types/) sur la plateforme d'apprentissage RostoDev._
