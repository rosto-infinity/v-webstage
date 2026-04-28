---
source_course: "typescript"
source_lesson: "typescript-unions"
---

# Types Unions

Un type union est une valeur qui peut être l'un de plusieurs types. C'est comme dire "ceci est une chaîne de caractères OU un nombre".

```typescript
function printId(id: number | string) {
  console.log("Votre ID est : " + id);
}
```

Si vous avez une union, vous ne pouvez accéder qu'aux membres valides pour _tous_ les types de l'union. Pour utiliser des méthodes spécifiques à un type (comme `toUpperCase()` pour les chaînes), vous avez besoin du **Narrowing** (raffinement de type).

## Raffinement avec les Type Guards

TypeScript est assez intelligent pour examiner vos vérifications de flux de contrôle (if/else, switch).

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    // Dans ce bloc, TS sait que id est une chaîne
    console.log(id.toUpperCase());
  } else {
    // Ici, id doit être un nombre
    console.log(id);
  }
}
```

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
