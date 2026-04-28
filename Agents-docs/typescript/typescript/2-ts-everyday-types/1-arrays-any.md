---
source_course: "typescript"
source_lesson: "typescript-primitives-arrays-any"
---

# Primitives

TypeScript prend en charge les mêmes primitives que JavaScript : `string`, `number`, `boolean`, `null`, `undefined`, `symbol` et `bigint`.

```typescript
const username: string = "Alice";
const count: number = 42;
const isActive: boolean = true;
```

## Tableaux

Vous pouvez définir des tableaux de deux manières :

```typescript
let list: number[] = [1, 2, 3];
let genericList: Array<number> = [1, 2, 3]; // Syntaxe générique
```

## Le type `any`

Le type `any` permet de désactiver la vérification des types. Il est utile lors de la migration de code JS mais doit être évité dans le nouveau code car il annule l'intérêt de TypeScript.

```typescript
let obj: any = { x: 0 };
obj.foo(); // Pas d'erreur à la compilation, mais pourrait planter à l'exécution !
```

## Inférence de Type

Souvent, vous n'avez pas besoin de spécifier les types. TypeScript les déduit pour vous :

```typescript
let x = 20; // TypeScript sait que x est un nombre
```

### Ressources

- [Manuel TypeScript : Types au Quotidien](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
