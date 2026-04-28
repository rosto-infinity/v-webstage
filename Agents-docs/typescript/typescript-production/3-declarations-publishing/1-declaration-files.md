---
source_course: "typescript-production"
source_lesson: "typescript-production-declaration-files"
---

# Fichiers de Déclaration

Les fichiers de déclaration (`.d.ts`) fournissent des informations de type pour le code JavaScript. Ils servent de pont entre votre code TS et les bibliothèques JS existantes.

## Déclarations d'Ambiance (Ambient Declarations)

Utilisez `declare` pour informer TypeScript de l'existence de quelque chose de global (comme une variable injectée par une balise script).

```typescript
declare const MY_GLOBAL_CONFIG: { apiUrl: string };
```

## Paquets @types

La plupart des bibliothèques populaires ont des types disponibles dans le dépôt DefinitelyTyped. Vous les installez via `@types/nom-de-la-bibliotheque`.

```bash
npm install --save-dev @types/lodash
```

### Ressources

- [Manuel TypeScript : Fichiers de Déclaration](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

---

> 📘 _Cette leçon fait partie du cours [TypeScript en Production](/typescript/typescript-production/) sur la plateforme d'apprentissage RostoDev._
