---
source_course: "typescript-production"
source_lesson: "typescript-production-compiler-options"
---

# Le fichier `tsconfig.json`

Ce fichier est la racine de votre projet TypeScript. Il contrôle le fonctionnement du compilateur.

## Drapeaux de Rigueur (Strictness)

Pour tirer le meilleur parti de TypeScript, vous devriez activer le mode strict.

- `strict` : Active toutes les options strictes de vérification de type. Recommandé : `true`.
- `noImplicitAny` : Lève une erreur sur les expressions et les déclarations ayant un type `any` implicite.
- `strictNullChecks` : Fait de `null` et `undefined` des types distincts. Sans cela, `null` peut être assigné à n'importe quoi (comme un nombre), ce qui peut entraîner des plantages à l'exécution.

## Options d'Émission (Emit)

- `target` : La version de JS à générer (ex: `ES2020`).
- `module` : Le système de modules à utiliser (ex: `CommonJS` pour l'ancien Node, `ESNext` pour les bundlers).
- `outDir` : L'endroit où placer les fichiers de sortie (généralement `./dist` ou `./build`).

### Ressources

- [Manuel TypeScript : Référence TSConfig](https://www.typescriptlang.org/tsconfig)

---

> 📘 _Cette leçon fait partie du cours [TypeScript en Production](/typescript/typescript-production/) sur la plateforme d'apprentissage RostoDev._
