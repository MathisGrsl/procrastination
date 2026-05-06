# Procrastination - Gestionnaire de Tâches Hebdomadaire

Une application web moderne et intuitive pour gérer vos tâches et combattre la procrastination. Organisez vos tâches par semaine, catégorisez-les et suivez votre productivité facilement.

## 🎯 À propos du projet

**Procrastination** est une application de gestion de tâches conçue pour vous aider à mieux organiser votre travail et vos activités. Elle permet de :

- **Planifier les tâches par jour** : Organisez vos tâches sur une vue hebdomadaire
- **Catégoriser** : Classez vos tâches par catégories (travail, personnel, etc.)
- **Définir des priorités** : Marquez vos tâches comme haute, normale ou basse priorité
- **Persister les données** : Vos tâches sont sauvegardées localement dans votre navigateur
- **Naviguer facilement** : Passez d'une semaine à l'autre pour planifier à l'avance

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** (version 14 ou supérieure)
- **npm** (généralement installé avec Node.js)

### Installation

1. **Cloner le repository**

```bash
git clone https://github.com/MathisGrsl/procrastination.git
cd procrastination
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Lancer l'application**

```bash
npm start
```

L'application s'ouvrira automatiquement dans votre navigateur à l'adresse `http://localhost:3000`.

## 💻 Technologies utilisées

- **React 18** : Framework UI moderne
- **TypeScript** : Typage statique pour plus de fiabilité
- **React Router** : Navigation entre les pages
- **CSS** : Styles modulaires et personnalisés
- **Local Storage** : Persistance des données côté client

## 📋 Fonctionnalités principales

### 📅 Vue hebdomadaire

- Affiche les 7 jours de la semaine
- Navigation facile entre les semaines (précédente/suivante)
- Bouton "Aujourd'hui" pour revenir à la semaine actuelle

### ✏️ Gestion des tâches

- **Ajouter une tâche** : Créez des tâches avec un titre, une catégorie et une priorité
- **Tâches en attente** : Zone pour les tâches en cours de planification
- **Assignation aux jours** : Glissez-déposez ou assignez les tâches aux jours spécifiques
- **Marquer comme complétée** : Cochez les tâches terminées
- **Supprimer** : Supprimez les tâches dont vous n'avez plus besoin

### 🏷️ Catégories

Les tâches peuvent être classées par :

- Travail
- Personnel
- Loisir
- Autre

### 🎨 Priorités

Définissez l'importance de chaque tâche :

- **Haute** : Urgent et important
- **Normale** : Priorité standard
- **Basse** : Peut être fait plus tard

## 📁 Structure du projet

```
src/
├── components/        # Composants React
│   ├── Calendar/     # Composant calendrier
│   ├── Day/          # Composant pour un jour
│   ├── Task/         # Composant pour une tâche
│   ├── Header/       # En-tête de l'application
│   ├── ContentDays/  # Affichage du contenu des jours
│   └── Sidebar/      # Barre latérale
├── hooks/            # Hooks personnalisés
│   └── useLocalStorage.ts
├── utils/            # Fonctions utilitaires
│   └── dateUtils.ts
├── types/            # Définitions TypeScript
│   └── index.ts
├── styles/           # Styles CSS et variables
├── App.tsx           # Composant principal
└── index.tsx         # Point d'entrée
```

## 🛠️ Scripts disponibles

### `npm start`

Lance l'application en mode développement. Ouvrez [http://localhost:3000](http://localhost:3000) pour la voir dans le navigateur.

### `npm build`

Compile l'application pour la production dans le dossier `build`.

### `npm test`

Lance la suite de tests.

## 💾 Stockage des données

L'application utilise **Local Storage** pour persister les données :

- Les tâches sont sauvegardées automatiquement dans le navigateur
- Aucun serveur n'est nécessaire
- Les données persisteront même après la fermeture du navigateur

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Bonne productivité ! 🚀**
