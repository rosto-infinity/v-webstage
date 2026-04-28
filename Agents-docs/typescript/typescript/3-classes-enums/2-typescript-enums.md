---
source_course: "typescript"
source_lesson: "typescript-enums"
---

# Enums

Les Enums vous permettent de définir un ensemble de constantes nommées. TypeScript fournit des enums numériques et basés sur des chaînes de caractères.

## Enums Numériques

Par défaut, les enums sont indexés à partir de zéro.

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}
```

## Enums de Chaînes (String Enums)

Les enums de chaînes sont plus lisibles lors du débogage.

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

Utilisez des enums lorsque vous avez un ensemble fermé de valeurs liées (comme les rôles d'utilisateur, les codes de statut ou les directions).

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
