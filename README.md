# RedOasis Tourism Super-App

Plateforme numérique de mise en valeur du patrimoine, de l'artisanat et du tourisme de la région du Gourara (Timimoun, Algérie).

## Fonctionnalités Principales (BMC Aligné)
- **Marketplace Artisanale** : Produits en poterie, tissage (Fatiss), سعف (Tadara).
- **Services Touristiques** : Maisons d'hôtes, hôtels, excursions et guides.
- **Ateliers Éducatifs (Workshops)** : Réservation d'expériences artisanales immersives.
- **Messagerie Interne** : Communication directe entre touristes, artisans et prestataires.
- **Publicité (Ads)** : Bannières sponsorisées pour les partenaires locaux mis en avant.
- **Multilingue (i18n)** : Support complet en Arabe, Anglais et Français.

## Démarrage Rapide (Développement Local)

1. **Installation des dépendances**
```bash
npm install
```

2. **Configuration de la Base de Données**
Copier `.env.example` vers `.env` (et `.env.local` pour Turso si applicable).
```bash
npx prisma generate
npx prisma db push   # Créer les tables en local (dev.db SQLite)
npx prisma db seed   # Peupler avec des données de test
```

3. **Lancement du serveur de développement**
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Gestion des Données et Contenus Locaux (Timimoun)

* **Images Libres de Droits (Timimoun)**
  Les images illustrant la région et l'artisanat sont situées dans `/public/images/timimoun/`. 
  Un script utilitaire `scratch/scrape-timimoun-images.py` est fourni pour télécharger une base d'images initiales depuis des sources publiques.
* **Contacts Locaux**
  L'annuaire des contacts (Hôtels, Guides, Coopératives) est géré dans `src/data/timimoun-contacts.ts`. Ajoutez ou modifiez des entrées dans ce tableau pour mettre à jour la section "Contacts Utiles" de la page Héritage.

## Déploiement sur Vercel

Ce projet est optimisé pour un déploiement fluide sur Vercel.
- Assurez-vous que le typage est correct avant de commit : `npx tsc --noEmit`
- Vercel exécutera `npm run build` automatiquement.
- Configurez les variables d'environnement (`DATABASE_URL`, `TURSO_AUTH_TOKEN`) dans le dashboard Vercel.
- Pour migrer la base de données de production sur Turso, utilisez les fichiers SQL de migration (ex: `diff.sql` ou `migration_phase2.sql`) via le CLI Turso ou des appels API. Ne lancez pas `prisma db push` directement sur Turso sans précaution.
