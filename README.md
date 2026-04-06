# Mon Projet — Full-Stack + DevOps

> Application full-stack avec pipeline CI/CD complet.
> Stack : **Next.js** · **Vert.x 5 (Java)** · **PostgreSQL** · **Jenkins** · **SonarQube** · **Docker**

---

## Architecture

```
┌─────────────┐     HTTP      ┌──────────────────┐     JDBC     ┌──────────────┐
│  Next.js    │ ───────────▶  │  Vert.x 5 (Java) │ ──────────▶ │  PostgreSQL  │
│  :3000      │               │  :8080            │             │  :5432       │
└─────────────┘               └──────────────────┘             └──────────────┘

Pipeline CI/CD
──────────────
GitHub Push → Jenkins → Tests → SonarQube Quality Gate → Docker Build → Deploy
```

---

## Prérequis

| Outil         | Version minimale |
|---------------|-----------------|
| Docker        | 24+             |
| Docker Compose| 2.x             |
| Java (local)  | 21              |
| Node.js       | 20              |

---

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/tonusername/mon-projet.git
cd mon-projet

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec tes valeurs

# 3. Lancer toute la stack
docker-compose up -d

# 4. Vérifier que tout tourne
docker-compose ps
```

| Service     | URL                        | Description              |
|-------------|----------------------------|--------------------------|
| Frontend    | http://localhost:3000      | Application Next.js      |
| Backend API | http://localhost:8080      | API REST Vert.x 5        |
| Jenkins     | http://localhost:8090      | CI/CD (admin/admin)      |
| SonarQube   | http://localhost:9000      | Qualité code (admin/admin)|

---

## Structure du projet

```
mon-projet/
├── frontend/                  # Application Next.js
│   ├── Dockerfile             # Multi-stage build
│   └── sonar-project.properties
├── backend/                   # API Vert.x 5 / Maven
│   ├── Dockerfile             # Multi-stage build
│   └── sonar-project.properties
├── jenkins/
│   └── Dockerfile             # Jenkins + Docker CLI + plugins
├── docker-compose.yml         # Orchestration locale complète
├── Jenkinsfile                # Pipeline CI/CD déclaratif
└── .env.example               # Template des variables d'env
```

---

## Pipeline CI/CD

```
┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  ┌───────────┐  ┌────────┐
│ Checkout │→ │  Tests   │→ │ SonarQube │→ │Quality Gate  │→ │  Docker   │→ │ Deploy │
│          │  │ JUnit    │  │ Analysis  │  │(bloque si KO)│  │   Build   │  │        │
└──────────┘  │ Jest     │  └───────────┘  └──────────────┘  └───────────┘  └────────┘
              │ JaCoCo   │
              └──────────┘
```

Le pipeline se déclenche automatiquement à chaque `git push` via webhook GitHub.
Le **Quality Gate bloque le déploiement** si la couverture de tests passe sous 70%
ou si un bug bloquant est détecté.

---

## Configuration Jenkins

Après le premier démarrage (`docker-compose up -d jenkins`) :

1. Ouvrir http://localhost:8090
2. Aller dans **Manage Jenkins > Credentials** et ajouter :
   - `sonar-token` — Token généré dans SonarQube (Security > Tokens)
   - `dockerhub-credentials` — Username/Password Docker Hub
3. Aller dans **Manage Jenkins > Configure System > SonarQube servers** :
   - Name : `SonarQube`
   - URL : `http://sonarqube:9000`
4. Créer un **Pipeline Job** pointant sur ce repo (branch `main`)

---

## Technologies utilisées

| Catégorie       | Technologie          | Rôle                              |
|-----------------|----------------------|-----------------------------------|
| Frontend        | Next.js 14, React    | Interface utilisateur             |
| Backend         | Vert.x 5, Java 21    | API REST réactive                 |
| Base de données | PostgreSQL 16        | Persistance                       |
| CI/CD           | Jenkins 2.452        | Automatisation du pipeline        |
| Qualité code    | SonarQube 10         | Analyse statique, couverture      |
| Conteneurisation| Docker, Compose      | Packaging et orchestration locale |

---

## Phases à venir

- [ ] **Phase 2** — Kubernetes (manifests YAML + Helm chart)
- [ ] **Phase 3** — AWS (EKS, ECR, RDS, Terraform)
- [ ] **Phase 4** — Observabilité (Prometheus + Grafana)
