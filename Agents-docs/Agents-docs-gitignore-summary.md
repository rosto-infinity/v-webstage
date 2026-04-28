# Résumé : Ignorer le dossier `Agents-docs` dans Git

## Contexte

Le dossier `Agents-docs` était déjà suivi par Git dans le dépôt. Cela signifie que même si tu ajoutes `/Agents-docs` dans `.gitignore`, Git continue de le suivre tant qu'il est déjà indexé.

## Objectif

Faire en sorte que Git cesse de suivre `Agents-docs` et utiliser `.gitignore` pour l'ignorer à l'avenir.

## Commandes exécutées

1. `git rm -r --cached Agents-docs`
   - Retire le dossier `Agents-docs` de l'index Git.
   - Le dossier reste présent localement, mais il n'est plus suivi.

2. `git add .gitignore`
   - Ajoute la modification du fichier `.gitignore` à l'index.
   - Le fichier contient déjà la ligne `/Agents-docs`.

3. `git commit -m "Stop tracking Agents-docs and ignore it"`
   - Crée un commit qui enregistre l'arrêt du suivi de `Agents-docs`.

4. `git push origin main`
   - Envoie le commit vers le dépôt distant GitHub.

## Pourquoi c'était nécessaire

- `.gitignore` empêche uniquement les nouveaux fichiers non suivis d'être ajoutés à Git.
- Si un fichier ou dossier est déjà suivi, il faut d'abord le retirer de l'index avec `git rm --cached`.

## Résultat final

- `Agents-docs/` reste présent sur ta machine.
- Git ne le suit plus.
- GitHub ne devrait plus l'afficher dans le dépôt principal lors des futurs commits.

## Contenu du `.gitignore`

La ligne nécessaire est :

```gitignore
/Agents-docs
```

C'est la bonne règle pour ignorer ce dossier à partir de la racine du dépôt.
