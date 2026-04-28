---
source_course: "typescript"
source_lesson: "typescript-generics-basics"
---

# Generics

Imaginez que vous vouliez une fonction qui retourne ce que vous lui passez. Sans les generics, vous pourriez utiliser `any`, mais vous perdriez alors la sécurité des types.

Les Generics vous permettent de créer une "variable de type" qui capture le type fourni par l'utilisateur.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Utilisation
let output = identity<string>("maChaine");
// T devient 'string', donc le type de retour est 'string'
```

## Interfaces Génériques

```typescript
interface Box<Type> {
  contents: Type;
}

let box: Box<string> = { contents: "hello" };
```

### Ressources

- [Manuel TypeScript : Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
