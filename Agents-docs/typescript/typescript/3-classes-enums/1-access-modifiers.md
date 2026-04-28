---
source_course: "typescript"
source_lesson: "typescript-classes-access-modifiers"
---

# Classes

TypeScript ajoute des annotations de type et des modificateurs d'accès aux classes JavaScript.

## Modificateurs d'Accès

- `public` (par défaut) : Accessible partout.
- `private` : Accessible uniquement au sein de la classe.
- `protected` : Accessible au sein de la classe et des sous-classes.

```typescript
class Person {
  protected name: string;
  private secrets: string[];

  constructor(name: string) {
    this.name = name;
    this.secrets = [];
  }
}

class Employee extends Person {
  sayHello() {
    // Peut accéder au 'name' protégé
    console.log(`Hi, I'm ${this.name}`);
    // Ne peut pas accéder aux 'secrets' privés
    // console.log(this.secrets); // Erreur
  }
}
```

### Ressources

- [Manuel TypeScript : Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
