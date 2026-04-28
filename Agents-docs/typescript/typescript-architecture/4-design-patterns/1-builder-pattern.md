---
source_course: "typescript-architecture"
source_lesson: "typescript-architecture-builder-pattern"
---

# Pattern Builder

Le pattern Builder est utile pour construire des objets complexes étape par étape. En TypeScript, nous pouvons l'utiliser pour garantir que tous les champs requis sont définis.

```typescript
class RequestBuilder {
  private url: string = "";
  private method: "GET" | "POST" = "GET";

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  setMethod(method: "GET" | "POST"): this {
    this.method = method;
    return this;
  }

  build() {
    return { url: this.url, method: this.method };
  }
}
```

L'utilisation de `this` comme type de retour permet le chaînage de méthodes, même dans les sous-classes.

---

> 📘 _Cette leçon fait partie du cours [Architecture & Patterns TypeScript](/typescript/typescript-architecture/) sur la plateforme d'apprentissage RostoDev._
