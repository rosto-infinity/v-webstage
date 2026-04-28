---
source_course: "typescript"
source_lesson: "typescript-type-assertions"
---

# Assertions de Type

Parfois, vous en savez plus sur le type d'une valeur que TypeScript lui-même. Vous pouvez utiliser le mot-clé `as` pour dire au compilateur "fais-moi confiance".

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

TypeScript n'autorise que les assertions qui semblent plausibles (par exemple, convertir un type plus spécifique vers un type moins spécifique ou vice versa). Pour les castings impossibles, utilisez `unknown` comme étape intermédiaire :

```typescript
const x = "hello" as unknown as number;
```

**Note** : Évitez d'utiliser la syntaxe `<Type>` dans les fichiers `.tsx` car elle entre en conflit avec JSX.

---

> 📘 _Cette leçon fait partie du cours [L'Essentiel de TypeScript](/typescript/typescript/) sur la plateforme d'apprentissage RostoDev._
