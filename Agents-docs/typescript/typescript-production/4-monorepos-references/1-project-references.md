---
source_course: "typescript-production"
source_lesson: "typescript-production-project-references"
---

# Références de Projet

Les références de projet vous permettent de structurer vos programmes TypeScript en morceaux plus petits.

## Le drapeau `composite`

Pour utiliser les références de projet, les projets référencés doivent avoir le paramètre `composite` activé dans leur `tsconfig.json`. Cela garantit que TypeScript peut déterminer rapidement si un projet a besoin d'être reconstruit.

```json
// libs/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true
  }
}
```

## Référencement

Dans votre projet principal :

```json
{
  "references": [{ "path": "../libs/core" }]
}
```

### Ressources

- [Manuel TypeScript : Références de Projet](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

> 📘 _Cette leçon fait partie du cours [TypeScript en Production](/typescript/typescript-production/) sur la plateforme d'apprentissage RostoDev._
