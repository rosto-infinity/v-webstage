---
source_course: "typescript-architecture"
source_lesson: "typescript-architecture-decorators-intro"
---

# Décorateurs

Les décorateurs offrent un moyen d'ajouter à la fois des annotations et une syntaxe de métaprogrammation pour les déclarations de classes et leurs membres. Ils font partie d'une proposition de niveau 3 (stage 3) pour JavaScript et sont largement utilisés dans des frameworks comme NestJS.

Pour les utiliser, activez l`experimentalDecorators` dans votre `tsconfig.json`.

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = "report";
}
```

Ils peuvent être attachés aux classes, méthodes, accesseurs, propriétés et paramètres.

---

> 📘 _Cette leçon fait partie du cours [Architecture & Patterns TypeScript](/typescript/typescript-architecture/) sur la plateforme d'apprentissage RostoDev._
