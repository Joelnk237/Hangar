// ─────────────────────────────────────────────────────────────
// Jenkinsfile — Pipeline CI/CD complet
// Stack : Next.js (frontend) + Vert.x 5/Maven (backend)
// Étapes : Checkout → Tests → SonarQube → Build Docker → Deploy
// ─────────────────────────────────────────────────────────────
pipeline {

    // Exécuter sur n'importe quel agent disponible
    agent any

    // ── Variables globales ──────────────────────────────────
    environment {
        // Récupérées depuis Jenkins > Manage Jenkins > Credentials
        SONAR_TOKEN    = credentials('SonarQube')
        DOCKER_HUB_ID  = credentials('dockerhub-credentials')

        IMAGE_FRONTEND = "localhost:5000/frontend"
        IMAGE_BACKEND  = "localhost:5000/backend"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"  // tag = numéro de build
    }

    // ── Options globales ────────────────────────────────────
    options {
        // timestamps()                          // Horodatage dans les logs
        // timeout(time: 30, unit: 'MINUTES')    // Abandon si > 30 min
        disableConcurrentBuilds()             // Un seul build à la fois
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // ── Déclencheurs ────────────────────────────────────────
    triggers {
        // Déclenché automatiquement à chaque push GitHub (via webhook)
        githubPush()
    }

    // ════════════════════════════════════════════════════════
    // STAGES
    // ════════════════════════════════════════════════════════
    stages {

        // ── 1. Checkout ─────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "Récupération du code source..."
                checkout scm
                sh 'git log --oneline -5'
            }
        }

        // ── 2. Tests Backend (Maven + JUnit) ─────────────────
        stage('Tests Backend') {
            steps {
                dir('backend') {
                    echo "Lancement des tests unitaires Vert.x..."
                    sh 'mvn test -B'
                }
            }
            post {
                always {
                    // Publier les résultats JUnit dans Jenkins
                    junit 'backend/target/surefire-reports/*.xml'
                    // Publier la couverture JaCoCo
                    jacoco(
                        execPattern:    'backend/target/jacoco.exec',
                        classPattern:   'backend/target/classes',
                        sourcePattern:  'backend/src/main/java'
                    )
                }
            }
        }

        // ── 3. Tests Frontend ────────────────────────────────
        stage('Tests Frontend') {
            steps {
                dir('frontend') {
                    echo "Lancement des tests Jest..."
                    sh 'npm ci'
                    sh 'npm test -- --coverage --watchAll=false'
                }
            }
            post {
                always {
                    junit 'frontend/test-results/**/*.xml'
                }
            }
        }

        // ── 4. Analyse SonarQube ─────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                echo "Analyse qualité du code..."
                // Le bloc withSonarQubeEnv utilise la config Jenkins
                // (Manage Jenkins > Configure System > SonarQube servers)
                withSonarQubeEnv('SonarQube') {
                    dir('backend') {
                        sh '''
                            mvn sonar:sonar \
                                -Dsonar.projectKey=mon-projet-backend \
                                -Dsonar.projectName="Mon Projet - Backend" \
                                -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                                -B
                        '''
                    }
                    dir('frontend') {
                        sh '''
                            npx sonar-scanner \
                                -Dsonar.projectKey=mon-projet-frontend \
                                -Dsonar.projectName="Mon Projet - Frontend" \
                                -Dsonar.sources=src \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        '''
                    }
                }
            }
        }

        // ── 5. Quality Gate (bloque si le code est trop mauvais) ──
        stage('Quality Gate') {
            steps {
                echo "Vérification du Quality Gate SonarQube..."
                // Attend le résultat de l'analyse (max 5 min)
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── 6. Build Docker Images ───────────────────────────
        stage('Build Docker Images') {
            steps {
                echo "Construction des images Docker..."
                sh """
                    docker build \
                        -t ${IMAGE_FRONTEND}:${IMAGE_TAG} \
                        -t ${IMAGE_FRONTEND}:latest \
                        ./frontend

                    docker build \
                        -t ${IMAGE_BACKEND}:${IMAGE_TAG} \
                        -t ${IMAGE_BACKEND}:latest \
                        ./backend
                """
            }
        }

        // ── 7. Push vers Docker Hub (ou ECR en Phase 3) ──────
        stage('Push Images') {
            // Seulement sur la branche main
            when {
                branch 'main'
            }
            steps {
                echo "Push des images vers le registry..."
                sh """
                    docker push ${IMAGE_FRONTEND}:${IMAGE_TAG}
                    docker push ${IMAGE_FRONTEND}:latest
                    docker push ${IMAGE_BACKEND}:${IMAGE_TAG}
                    docker push ${IMAGE_BACKEND}:latest
                """
            }
        }

        // ── 8. Déploiement (docker-compose en local) ─────────
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo "Déploiement de la nouvelle version..."
                sh """
                    IMAGE_TAG=${IMAGE_TAG} docker-compose up -d \
                        --no-deps \
                        frontend backend
                """
            }
        }
    }

    // ════════════════════════════════════════════════════════
    // POST — Notifications finales
    // ════════════════════════════════════════════════════════
    post {
        success {
            echo "Pipeline réussi — build #${env.BUILD_NUMBER}"
            // Tu peux ajouter une notif Slack/email ici (Phase suivante)
        }
        failure {
            echo "Pipeline échoué — consulte les logs ci-dessus"
        }
        
    }
}
