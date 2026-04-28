---
source_course: "vue-foundations"
source_lesson: "vue-foundations-props"
---

# Passer des Données avec les Props (Props)

Les `Props` ("Properties") sont des attributs personnalisés que vous pouvez déclarer sur un composant enfant. Elles permettent exclusivement à un composant "Parent" de passer des données descendantes vers ses "Enfants".

## Définir des Props

Utilisez la macro `defineProps()` pour déclarer quelles props un composant est autorisé à recevoir :

```vue
<!-- src/components/GreetingCard.vue -->
<script setup lang="ts">
// On définit l'interface (TS) des Props attendues
const props = defineProps<{
  name: string;
  age?: number; // Le '?' signifie que cette prop est complètement optionnelle
}>();
</script>

<template>
  <div class="greeting">
    <!-- On peut utiliser les props directement dans le HTML ! -->
    <h2>Bonjour, {{ name }} !</h2>
    <p v-if="age">Vous avez {{ age }} ans.</p>
  </div>
</template>
```

## Passer des Props depuis un Parent

Passez les données au composant Enfant, exactement comme s'il s'agissait d'attributs HTML standards (comme `href` ou `src`) :

```vue
<!-- Composant Parent (App.vue par ex) -->
<script setup lang="ts">
import GreetingCard from "./components/GreetingCard.vue";
import { ref } from "vue";

const userName = ref("Alice");
const userAge = ref(25);
</script>

<template>
  <!-- Props Statiques (Du texte brut en dur) -->
  <GreetingCard name="Bob" />

  <!-- Le `:` (v-bind) est OBLIGATOIRE si on veut passer un vrai Nombre, Booléen, ou objet JS ! -->
  <GreetingCard name="Charlie" :age="30" />

  <!-- Props Dynamiques (Liées à des variables réactives du Parent via v-bind) -->
  <GreetingCard :name="userName" :age="userAge" />
</template>
```

## Typage des Props

### Avec TypeScript (Hautement Recommandé)

```vue
<script setup lang="ts">
type Status = "pending" | "active" | "completed";

type User = {
  id: number;
  name: string;
  email: string;
};

const props = defineProps<{
  // Chaîne de caractères Requise
  title: string;

  // Nombre Optionnel
  count?: number;

  // Tableau de Strings
  tags: string[];

  // Objet complexe Typé
  user: User;

  // Type d'Union restrictif
  status: Status;

  // Booléen
  isActive: boolean;

  // Fonction (Callback)
  onUpdate: (value: string) => void;
}>();
</script>
```

### Valeurs par Défaut

Utilisez la macro `withDefaults()` pour injecter des valeurs par défaut si le parent "oublie" ou choisit de ne pas fournir la donnée optionnelle :

```vue
<script setup lang="ts">
type Props = {
  title: string;
  count?: number;
  items?: string[];
  theme?: "light" | "dark";
};

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [], // OBLIGATION de retourner Tableaux et Objets depuis une fléchée (Factory) !
  theme: "light",
});
</script>
```

## Utiliser les Props dans le Template

Les props déclarées sont toutes accessibles de manière totalement transparente dans votre balise `<template>` :

```vue
<script setup lang="ts">
const props = defineProps<{
  title: string;
  items: string[];
  showHeader: boolean;
}>();
</script>

<template>
  <div class="container">
    <h1 v-if="showHeader">{{ title }}</h1>
    <ul>
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
```

## Règle d'Or Absolue : Les Props sont en Lecture Seule ! (Read-Only)

C'est LE piège le plus classique et fatal des débutants dans Vue (et React) : Vous n'avez **absolument jamais** le droit de modifier brutalement une prop. Le flux de données est strictement unidirectionnel : il coule du Parent vers l'Enfant. Jamais l'inverse.

```vue
<script setup lang="ts">
const props = defineProps<{
  count: number;
}>();

// ❌ CRIME GRAVE : Ne JAMAIS faire ça - Cela brisera la boucle de Vue et affichera un gros warning rouge
function increment() {
  props.count++; // Erreur Fatale : La propriété est Read-Only (Constante) !
}

// ✅ SEULE BONNE MÉTHODE : Émettre gentiment un message de requête au Parent
// "Hé patron, tu devrais vraiment mettre TA variable 'count' à jour +1"
const emit = defineEmits<{
  update: [newCount: number];
}>();

function increment() {
  emit("update", props.count + 1);
}
</script>
```

## Exemple Pratique Complet du Monde Réel : Carte Produit

```vue
<!-- src/components/ProductCard.vue -->
<script setup lang="ts">
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
};

const props = withDefaults(
  defineProps<{
    product: Product;
    showActions?: boolean;
  }>(),
  {
    showActions: true, // Affiche les boutons d'achats par défaut
  },
);

// On déclare les événements d'alerte que ce composant peut crier en haut à son père
const emit = defineEmits<{
  addToCart: [productId: number];
}>();

function formatPrice(price: number): string {
  return `${price.toFixed(2)} €`;
}
</script>

<template>
  <div class="product-card">
    <!-- On parcourt allègrement "product" transmis par le père -->
    <img :src="product.image" :alt="product.name" />

    <div class="content">
      <h3>{{ product.name }}</h3>
      <p class="price">{{ formatPrice(product.price) }}</p>

      <!-- Classe CSS conditionnelle -->
      <span :class="['stock', { 'in-stock': product.inStock }]">
        {{ product.inStock ? "En Stock" : "Rupture" }}
      </span>
    </div>

    <!-- Boutons d'actions gérés par la prop optionnelle "showActions" -->
    <div v-if="showActions" class="actions">
      <!-- Quand on clique sur le bouton de MON COMPOSANT, il EMET simplement au PARENT -->
      <button
        @click="emit('addToCart', product.id)"
        :disabled="!product.inStock"
      >
        Ajouter au Panier
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.content {
  padding: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #42b883;
}

.stock {
  font-size: 0.875rem;
  color: #e53e3e;
}

.stock.in-stock {
  color: #38a169;
}

.actions {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}
</style>
```

```vue
<!-- Utilisation dans une Vue Parente Principale (Ex: Page Catalogue de la Boutique) -->
<script setup lang="ts">
import ProductCard from "./components/ProductCard.vue";
import { ref } from "vue";

const products = ref([
  {
    id: 1,
    name: "MacBook Pro",
    price: 1999.0,
    image: "/laptop.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 15",
    price: 999.0,
    image: "/phone.jpg",
    inStock: false,
  },
]);

// La fonction parent qui écoute le "cri d'alerte" (événement) 'add-to-cart' de ses enfants
function handleAddToCart(productId: number) {
  console.log(
    "Demande d'ajout au panier reçue depuis la carte d'ID :",
    productId,
  );
  // ... Logique de Panier global Pinia / BDD ...
}
</script>

<template>
  <div class="products-grid">
    <!-- On boucle avec v-for, on passe L'OBJET ENTIER en tant que prop, et on ECOUTE '@' les retours dans la foulée ! -->
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>
```

## Ressources

- [Gérer les Props](https://vuejs.org/guide/components/props.html) — Documentation officielle de Vue sur les Props.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
