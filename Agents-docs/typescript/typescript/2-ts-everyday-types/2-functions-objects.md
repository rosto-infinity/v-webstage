---
source_course: "typescript"
source_lesson: "typescript-functions-objects"
---

# Fonctions

Vous pouvez ajouter des types aux paramètres et aux valeurs de retour.

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

Si vous ne fournissez pas de type de retour, TypeScript le déduira en fonction des instructions `return`.

## Types d'Objets

Pour définir la forme d'un objet :

```typescript
function printCoord(pt: { x: number; y: number }) {
  console.log("x: " + pt.x);
  console.log("y: " + pt.y);
}
```

## Propriétés Optionnelles

Utilisez `?` pour marquer une propriété comme optionnelle. S'il y a un accès, elle peut être `undefined`.

```typescript
function printName(obj: { first: string; last?: string }) {
  // obj.last pourrait être undefined ici
}
```

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
