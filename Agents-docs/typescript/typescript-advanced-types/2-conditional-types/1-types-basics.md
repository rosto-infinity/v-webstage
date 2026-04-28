---
source_course: "typescript-advanced-types"
source_lesson: "typescript-advanced-types-conditional-types-basics"
---

# Types Conditionnels

Les types conditionnels vous permettent de choisir des types en fonction d'autres types. Ils prennent la forme :

```typescript
SomeType extends OtherType ? TrueType : FalseType;
```

Exemple :

```typescript
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

## Le mot-clé `infer`

Dans la clause `extends` d'un type conditionnel, vous pouvez utiliser `infer` pour déclarer une variable de type à inférer.

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

Ici, nous vérifions si `T` est une fonction. Si c'est le cas, nous inférons son type de retour comme `R` et retournons `R`. Sinon, nous retournons `any`.

### Ressources

- [Manuel TypeScript : Types Conditionnels](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

---

> 📘 _Cette leçon fait partie du cours [Maîtrise du Système de Types TypeScript](/typescript/typescript-advanced-types/) sur la plateforme d'apprentissage RostoDev._
