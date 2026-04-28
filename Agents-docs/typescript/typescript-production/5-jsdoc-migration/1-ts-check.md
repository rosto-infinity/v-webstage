---
source_course: "typescript-production"
source_lesson: "typescript-production-jsdoc-ts-check"
---

# Support JSDoc

TypeScript peut vérifier les fichiers JavaScript en utilisant les commentaires JSDoc.

Ajoutez `// @ts-check` au début d'un fichier `.js` pour activer la vérification de type.

```javascript
// @ts-check

/**
 * @param {string} name
 * @returns {string}
 */
function greet(name) {
  return "Bonjour " + name;
}
```

## La balise `@satisfies`

TypeScript 5.0 a introduit `@satisfies` pour vérifier si une valeur correspond à un type sans l'élargir (similaire à l'opérateur `satisfies` en TS).

```javascript
/** @satisfies {CompilerOptions} */
let config = { outDir: "./dist" };
```

---

> 📘 _Cette leçon fait partie du cours [TypeScript en Production](/typescript/typescript-production/) sur la plateforme d'apprentissage RostoDev._
