---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-prop-validation"
---

# Validation Avancée des Props

Les props sont le mécanisme principal pour passer des données d'un composant parent à un composant enfant. Dans cette leçon, nous explorons les techniques de validation avancées pour créer des composants robustes et auto-documentés.

## Déclaration Runtime vs Basée sur les Types

Vue offre deux façons de déclarer les props :

### Basée sur les Types (TypeScript)

```vue
<script setup lang="ts">
type Status = "pending" | "active" | "completed";

const props = defineProps<{
  title: string;
  count: number;
  status: Status;
  items?: string[];
}>();
</script>
```

### Déclaration Runtime

```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    validator: (value) => ["pending", "active", "completed"].includes(value),
  },
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
```

## Options de Type des Props

Vue supporte ces constructeurs natifs :

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

### Types Multiples

```vue
<script setup>
const props = defineProps({
  // Peut être String OU Number
  id: [String, Number],

  // Avec options complètes
  value: {
    type: [String, Number],
    required: true,
  },
});
</script>
```

## Validateurs Personnalisés

Les validateurs retournent `true` pour les valeurs valides, `false` pour les invalides :

```vue
<script setup>
const props = defineProps({
  // Validation de type enum
  size: {
    type: String,
    default: "medium",
    validator: (value) => {
      return ["small", "medium", "large", "xl"].includes(value);
    },
  },

  // Validation de plage
  percentage: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100,
  },

  // Validation de format email
  email: {
    type: String,
    validator: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
  },

  // Validation de la forme d'un objet
  user: {
    type: Object,
    validator: (value) => {
      return value.id && value.name && typeof value.id === "number";
    },
  },
});
</script>
```

## Valeurs par Défaut

### Valeurs par Défaut Primitives

```vue
<script setup>
const props = defineProps({
  message: {
    type: String,
    default: "Hello World",
  },
  count: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
</script>
```

### Valeurs par Défaut Objet/Tableau (Fonctions Factory)

Utilisez toujours des fonctions factory pour les objets et tableaux afin d'éviter les références partagées :

```vue
<script setup>
const props = defineProps({
  // ❌ Faux - référence partagée entre les instances
  // items: { type: Array, default: [] },

  // ✅ Correct - nouveau tableau pour chaque instance
  items: {
    type: Array,
    default: () => [],
  },

  config: {
    type: Object,
    default: () => ({
      theme: "light",
      showHeader: true,
      maxItems: 10,
    }),
  },

  user: {
    type: Object,
    default: () => ({
      name: "Invité",
      role: "viewer",
    }),
  },
});
</script>
```

## TypeScript avec withDefaults

Combinez les types TypeScript avec des valeurs par défaut :

```vue
<script setup lang="ts">
type Size = "sm" | "md" | "lg";
type Theme = "light" | "dark";

type Props = {
  title: string;
  size?: Size;
  theme?: Theme;
  items?: string[];
  config?: {
    showHeader: boolean;
    maxItems: number;
  };
};

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  theme: "light",
  items: () => [],
  config: () => ({
    showHeader: true,
    maxItems: 10,
  }),
});
</script>
```

## Props Requises

Marquez les props qui doivent obligatoirement être fournies :

```vue
<script setup lang="ts">
// TypeScript - l'absence de ? signifie requis
const props = defineProps<{
  id: number; // Requis
  name: string; // Requis
  description?: string; // Optionnel
}>();
</script>
```

```vue
<script setup>
// Déclaration runtime
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String, // Optionnel par défaut
});
</script>
```

## Avertissements de Validation

En développement, Vue émet des avertissements en cas d'échec de validation :

```
[Vue warn]: Invalid prop: custom validator check failed for prop "size".
[Vue warn]: Missing required prop: "id"
[Vue warn]: Invalid prop: type check failed for prop "count". Expected Number, got String.
```

Ces avertissements n'apparaissent qu'en mode développement, pas dans les builds de production.

## Ressources

- [Documentation des Props](https://vuejs.org/guide/components/props.html) — Documentation officielle Vue sur les props

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
