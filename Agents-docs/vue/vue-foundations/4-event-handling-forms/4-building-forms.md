---
source_course: "vue-foundations"
source_lesson: "vue-foundations-building-forms"
---

# Construire des Formulaires Complets (Building Forms)

Mettons absolument tout ce que nous avons appris ensemble pour construire un véritable formulaire professionnel du monde réel, incluant : validation en temps réel, gestion de la soumission réseau, et retours visuels pour l'utilisateur.

## Un Formulaire d'Inscription Complet

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

// 1. Les données brutes du formulaire
const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  agreeToTerms: false,
});

// 2. L'état global du formulaire (Interface)
const isSubmitting = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

// 3. Le Moteur de Validation (Computed)
const errors = computed(() => {
  // En TS, Record définit un objet où les clés sont des strings et les valeurs des strings
  const errs: Record<string, string> = {};

  // Validation de l'Email
  if (!form.value.email) {
    errs.email = "L'adresse e-mail est requise.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errs.email = "Veuillez entrer une adresse e-mail valide.";
  }

  // Validation du Nom
  if (!form.value.name) {
    errs.name = "Le nom complet est requis.";
  } else if (form.value.name.length < 2) {
    errs.name = "Le nom doit comporter au moins 2 caractères.";
  }

  // Validation du Mot de Passe
  if (!form.value.password) {
    errs.password = "Le mot de passe est requis.";
  } else if (form.value.password.length < 8) {
    errs.password = "Le mot de passe doit comporter au moins 8 caractères.";
  }

  // Confirmation du Mot de Passe
  if (form.value.password !== form.value.confirmPassword) {
    errs.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  // Acceptation des CGU
  if (!form.value.agreeToTerms) {
    errs.agreeToTerms =
      "Vous devez accepter les conditions générales d'utilisation.";
  }

  return errs;
});

// Le formulaire est valide SI le tableau des clés d'erreurs est vide (0)
const isValid = computed(() => Object.keys(errors.value).length === 0);

// 4. Suivi d'interaction utilisateur (Pister les champs déjà touchés pour ne pas crier trop tôt)
const touched = ref<Record<string, boolean>>({});

function markTouched(field: string) {
  touched.value[field] = true;
}

// Devons-nous afficher l'erreur en rouge ? (Seulement s'il a cliqué dessus ET qu'il y a une erreur)
function shouldShowError(field: string): boolean {
  return touched.value[field] && !!errors.value[field];
}

// 5. Soumission au backend réseau
async function handleSubmit() {
  // Dès qu'on soumet, on marque TOUS les champs comme "touchés" pour forcer l'affichage de toutes les alertes rouges
  Object.keys(form.value).forEach((key) => {
    touched.value[key] = true;
  });

  // Sécurité: on bloque l'envoi réseau si le Front-End juge que c'est invalide
  if (!isValid.value) {
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  try {
    // ➡️ Ici, vous feriez votre vrai `fetch` ou `axios` vers l'API Laravel/Node
    // Simulation réseau (1.5 secondes)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulation d'une erreur venant du backend côté serveur (ex: "Email Déjà pris") (20% de chances)
    if (Math.random() < 0.2) {
      throw new Error("Cette adresse e-mail est déjà associée à un compte.");
    }

    // Tout a marché !
    submitSuccess.value = true;
    console.log("Compte créé avec succès :", form.value);
  } catch (error) {
    // Problème général de récupération de l'erreur
    submitError.value =
      error instanceof Error
        ? error.message
        : "Échec de la création du compte.";
  } finally {
    // Quoi qu'il arrive (succès ou échec), on arrête le spinner de chargement
    isSubmitting.value = false;
  }
}

// 6. Remise à zéro totale
function resetForm() {
  form.value = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    agreeToTerms: false,
  };
  touched.value = {};
  submitError.value = "";
  submitSuccess.value = false;
}
</script>

<template>
  <div class="form-container">
    <h2>Créer un Compte</h2>

    <!-- Message final de Succès Absolu -->
    <div v-if="submitSuccess" class="success-message">
      <p>Compte créé avec succès ! Bienvenue à bord.</p>
      <button @click="resetForm">Créer un autre compte</button>
    </div>

    <!-- Formulaire d'Inscription classique -->
    <form v-else @submit.prevent="handleSubmit">
      <!-- Champ : Nom -->
      <div class="form-group">
        <label for="name">Nom Complet</label>
        <input
          id="name"
          v-model.trim="form.name"
          type="text"
          :class="{ error: shouldShowError('name') }"
          @blur="markTouched('name')"
        />
        <!-- Le @blur (perte de focus) sert à dire "Ok, il a quitté le champ en le laissant vide, AFFICHE LE ROUGE !" -->
        <span v-if="shouldShowError('name')" class="error-text">
          {{ errors.name }}
        </span>
      </div>

      <!-- Champ : Email -->
      <div class="form-group">
        <label for="email">Adresse E-mail</label>
        <input
          id="email"
          v-model.trim="form.email"
          type="email"
          :class="{ error: shouldShowError('email') }"
          @blur="markTouched('email')"
        />
        <span v-if="shouldShowError('email')" class="error-text">
          {{ errors.email }}
        </span>
      </div>

      <!-- Champ : Mot de passe -->
      <div class="form-group">
        <label for="password">Mot de Passe</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          :class="{ error: shouldShowError('password') }"
          @blur="markTouched('password')"
        />
        <span v-if="shouldShowError('password')" class="error-text">
          {{ errors.password }}
        </span>
      </div>

      <!-- Confirm password -->
      <div class="form-group">
        <label for="confirmPassword">Confirmez le Mot de Passe</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          :class="{ error: shouldShowError('confirmPassword') }"
          @blur="markTouched('confirmPassword')"
        />
        <span v-if="shouldShowError('confirmPassword')" class="error-text">
          {{ errors.confirmPassword }}
        </span>
      </div>

      <!-- Checkbox : CGU -->
      <div class="form-group checkbox">
        <label>
          <!-- '@change' est pour les checkboxs ce que '@blur' est aux inputs -->
          <input
            v-model="form.agreeToTerms"
            type="checkbox"
            @change="markTouched('agreeToTerms')"
          />
          J'accepte les Conditions Générales d'Utilisation
        </label>
        <span v-if="shouldShowError('agreeToTerms')" class="error-text">
          {{ errors.agreeToTerms }}
        </span>
      </div>

      <!-- Erreur Globale Retour Serveur (Backend) -->
      <div v-if="submitError" class="error-message">
        {{ submitError }}
      </div>

      <!-- Bouton central de Soumission -->
      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        <!-- Change le texte pour un feedback immédiat ! -->
        {{ isSubmitting ? "Création en cours..." : "Créer mon Compte" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Un peu de CSS pour adoucir les angles */
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input.error {
  border-color: #e53e3e; /* Une bordure bien rouge et agressive */
}

.error-text {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #42b883; /* Le beau vert VueJS */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.success-message {
  background: #c6f6d5;
  color: #276749;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}
</style>
```

Ce formulaire est un cas d'école professionnel qui démontre absolument tous les patterns vitaux de Vue :

- **État de Formulaire Réactif** utilisant simplement un gros objet `ref()`.
- **Validation Calculée (Computed)** qui se met à jour magiquement et automatiquement à chaque touche frappée.
- **Suivi des Interactions (Touches Focus)** pour éviter d'agresser l'utilisateur avec des champs rouges avant même qu'il n'ait fini de taper.
- **Désactivation pendant les requêtes Réseau** pendant toute la durée de la soumission.
- **Gestion des Erreurs Server-Side**.
- **Réinitialisation Instantanée** à la fin du flux.
- **Accessibilité HTML** primordiale avec les attributs `id` et `for`.

## Ressources

- [Gestion des formulaires](https://vuejs.org/guide/essentials/forms.html) — Le guide officiel de création de formulaires natifs avec Vue.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
