---
source_course: "typescript-production"
source_lesson: "typescript-production-module-resolution-strategies"
---

# Résolution de Modules

La résolution de modules est le processus que le compilateur utilise pour déterminer ce à quoi un import fait référence.

## Node vs Bundler

- `Node` (ou `Node10`) : Imite la recherche standard de Node.js (recherche dans `node_modules`, vérification de `index.js`, etc.).
- `Node16` / `NodeNext` : Supporte les modules ECMAScript (ESM) dans Node.js, en respectant le champ `exports` du `package.json` et en exigeant les extensions de fichiers dans les imports.
- `Bundler` : Idéal pour les bundlers modernes comme Vite/Webpack. Il comprend les règles d'import de TS mais laisse la logique de résolution finale (comme deviner l'extension) au bundler.

## Path Mapping (Mappage de Chemins)

Vous pouvez mapper des imports vers des chemins spécifiques en utilisant `paths` dans les `compilerOptions`. Cela permet des imports plus propres comme `@utils/date` au lieu de `../../../utils/date`.

```json
"paths": {
  "@utils/*": ["src/utils/*"]
}
```

---

> 📘 _Cette leçon fait partie du cours [TypeScript en Production](/typescript/typescript-production/) sur la plateforme d'apprentissage RostoDev._
