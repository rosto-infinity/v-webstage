---
source_course: "typescript"
source_lesson: "typescript-why-typescript"
---

# Pourquoi TypeScript ?

TypeScript est un sur-ensemble de JavaScript qui ajoute le typage statique. Cela signifie que vous pouvez intercepter les erreurs au moment de la compilation plutôt qu'à l'exécution.

```typescript
function greet(name: string) {
  console.log("Hello, " + name);
}

// greet(42); // Erreur : L'argument de type 'number' n'est pas atteignable au paramètre de type 'string'.
```

## Avantages

- **Sécurité** : Interceptez les bugs tôt (comme les fautes de frappe ou le passage d'un mauvais type).
- **Outillage** : Meilleure auto-complétion, navigation et refactoring dans votre IDE.
- **Lisibilité** : Les types servent de documentation qui ne devient jamais obsolète.

## Le Compilateur

Les navigateurs comprennent JavaScript, pas TypeScript. Vous devez compiler (ou "transpiler") le TS en JS à l'aide du compilateur TypeScript (`tsc`).

### Ressources

- [Manuel TypeScript : Les Bases](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
