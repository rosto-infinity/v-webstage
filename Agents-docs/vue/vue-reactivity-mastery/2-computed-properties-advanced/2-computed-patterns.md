---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-computed-patterns"
---

# Les Architectures Avancées des Computed Properties

Explorons les modèles d'architecture sophistiqués et industriels pour exploiter la toute-puissance des propriétés calculées (computed properties).

## Filtres et Tris Complexes de Données (Le Cas d'Usage Royal)

```typescript
import { ref, computed } from "vue";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};

// Donnée Brute (La Base Mère)
const products = ref<Product[]>([
  /* ... des milliers ... */
]);

// Les 5 États Moteurs du Filtre
const searchQuery = ref("");
const selectedCategory = ref("all");
const showOnlyInStock = ref(false);
const sortBy = ref<"name" | "price">("name");
const sortOrder = ref<"asc" | "desc">("asc");

// Computed Magique : Gère les 5 filtres dynamiquement et cache le résultat hyper lourd !
const filteredProducts = computed(() => {
  let result = products.value;

  // 1. Filtre par Texte
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(query));
  }

  // 2. Filtre par Catégorie Select
  if (selectedCategory.value !== "all") {
    result = result.filter((p) => p.category === selectedCategory.value);
  }

  // 3. Filtre par Checkbox de Stock
  if (showOnlyInStock.value) {
    result = result.filter((p) => p.inStock);
  }

  // 4 & 5. Tris Multidimensionnels
  result = [...result].sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];
    const modifier = sortOrder.value === "asc" ? 1 : -1;

    // Tri String Alphabetique !
    if (typeof aVal === "string") {
      return aVal.localeCompare(bVal as string) * modifier;
    }
    // Tri Numérique !
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  return result; // Boom : Mis en cache gratuit !
});

// Dérivation Ultime de la data dérivée : Des Statistiques temps réel pures !
const stats = computed(() => ({
  total: products.value.length, // Donnée Mère
  filtered: filteredProducts.value.length, // Donnée Calculée
  inStock: filteredProducts.value.filter((p) => p.inStock).length,
  // Moyenne des prix !
  avgPrice:
    filteredProducts.value.reduce((sum, p) => sum + p.price, 0) /
      filteredProducts.value.length || 0,
}));
```

## Mémoïsation d'Opérations Algorithmiques Coûteuses

Par essence un computed est un outil de mémorisation ("Memoise"), idéal pour éviter de cramer votre RAM/CPU ! :

```typescript
import { ref, computed } from "vue";

const points = ref<[number, number][]>([
  /* Des dizaines de milliers de point GPS géographiques polygonaux */
]);
const tolerance = ref(0.1);

// Calcul Mathématique Extrêmement Lourd CPU - Mais ne recalcule QUE SI et SEULEMENT SI les points raw ou la Tolérance mutent
const simplifiedPath = computed(() => {
  console.time("simplify");
  // Fonction pur JS méga lourde
  const result = douglasPeuckerSimplify(points.value, tolerance.value);
  console.timeEnd("simplify");
  return result;
});

// Les Datas dérivées du dessous sont alors totalement indolores et gratuites !
const pathLength = computed(() => calculatePathLength(simplifiedPath.value));

const boundingBox = computed(() => calculateBounds(simplifiedPath.value));
```

## Validateur Géant de Formulaire Industriel

```typescript
import { reactive, computed } from "vue";

const form = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
});

// Computed Dictateur Magistral qui crache un objet d'erreurs global
const validation = computed(() => {
  const errors: Record<string, string> = {};

  // Email validation stricte
  if (!form.email) {
    errors.email = "L'adresse Email est requise";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format d'adresse email invalide";
  }

  // Password validation stricte Sécurité
  if (!form.password) {
    errors.password = "Le Mot de passe est requis";
  } else if (form.password.length < 8) {
    errors.password = "Le Mot de passe doit comporter au moins 8 caractères";
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = "Le Mot de passe doit contenir une lettre Majuscule !";
  }

  // Confirm password
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Les deux Mots de passe ne correspondent pas";
  }

  // Age
  const age = parseInt(form.age);
  if (isNaN(age) || age < 18 || age > 120) {
    errors.age = "Veuillez saisir un âge humain valide SVP (18-120)";
  }

  return errors;
});

// Validation Boolean Ultime: (Si l'objet "validation" rendu au dessus pèse 0 bytes, c'est que form tout Ok !)
const isValid = computed(() => Object.keys(validation.value).length === 0);

// Récupérateur du tout 1er message d'erreur de la pile pour afficher dans un vilain toast rouge :
const firstError = computed(() => Object.values(validation.value)[0] || null);
```

## Croisement de Sources Externes API (Devise Currency Exchange)

```typescript
import { ref, computed } from "vue";

// Nos Rates (Taux)
const exchangeRates = ref<Record<string, number>>({
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
});

// Le portefeuille d'assets
const amounts = ref([
  { currency: "USD", value: 100 },
  { currency: "EUR", value: 200 },
  { currency: "GBP", value: 150 },
]);

// Le ciblage interface
const targetCurrency = ref("USD");

const convertedAmounts = computed(() => {
  const targetRate = exchangeRates.value[targetCurrency.value];

  return amounts.value.map((amount) => {
    const sourceRate = exchangeRates.value[amount.currency];
    const inUSD = amount.value / sourceRate;
    const converted = inUSD * targetRate;

    return {
      ...amount,
      converted: Math.round(converted * 100) / 100,
      targetCurrency: targetCurrency.value,
    };
  });
});

const totalConverted = computed(() =>
  convertedAmounts.value.reduce((sum, a) => sum + a.converted, 0),
);
```

## Le Moteur de Pagination Universel Absolu

```typescript
import { ref, computed } from "vue";

const allItems = ref<Item[]>([
  /* des centaines d'objets JS */
]);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// 1. Calcul Magistral Mathématique du Total  de Page "arrondi au dessus (ceil)"
const totalPages = computed(() =>
  Math.ceil(allItems.value.length / itemsPerPage.value),
);

// 2. Le Coupeur (Extirpateur de la tranche de 10 résultats !)
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allItems.value.slice(start, end);
});

// 3. Le Dessinateur de Puce Intelligente [...]
const pageNumbers = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  // Règle IA Spéciale : Affiche le premier, le dernier, et SEULEMENT les pages immédiatement adjacentes et mitoyennes (-2 ou +2 max !)
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 2 && i <= current + 2)) {
      pages.push(i);
    }
  }

  return pages;
});

// Sécurités Boutons Interfaces
const canGoPrevious = computed(() => currentPage.value > 1);
const canGoNext = computed(() => currentPage.value < totalPages.value);
```

## Ressources Primordiales Officielles

- [Les Bonnes Pratiques en Propriétés Calculées (À Lire Absolument)](https://vuejs.org/guide/essentials/computed.html#best-practices) — Un guide hyper court et strict de la Core Team sur les bonnes mœurs d'un computed en ingénierie d'entreprise.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
