---
source_course: "typescript"
source_lesson: "typescript-unknown-never"
---

# Le type `unknown`

`unknown` est la contrepartie type-safe de `any`. Vous pouvez tout affecter à `unknown`, mais vous ne pouvez rien en faire tant que vous ne l'avez pas affiné.

```typescript
let value: unknown;
value = true;

// let x: boolean = value; // Erreur
if (typeof value === "boolean") {
  let x: boolean = value; // OK
}
```

## Le type `never`

`never` représente des valeurs qui ne se produisent jamais (comme une fonction qui lève toujours une erreur). Il est utile dans les vérifications exhaustives.

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}
```

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
