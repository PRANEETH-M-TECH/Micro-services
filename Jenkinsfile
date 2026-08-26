pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        // Jenkins checks out a fresh clone per build, which never includes .env (gitignored).
        // The real secrets live once in the bind-mounted repo folder at /workspace/.env —
        // point every compose invocation at that stable file instead of relying on one
        // living next to the compose file in the throwaway build checkout.
        COMPOSE = 'docker compose --env-file /workspace/.env'
        // Jenkins runs in its own container; ports published by the app stack are on the
        // HOST, not inside Jenkins's own network namespace. host.docker.internal is the
        // Docker Desktop DNS name that reaches back out to the host from any container.
        APP_HOST = 'host.docker.internal'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test — Backend') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    sh 'npm test'
                }
            }
        }

        stage('Install & Test — Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm test'
                }
            }
        }

        stage('Build Images') {
            steps {
                sh "${COMPOSE} build"
            }
        }

        stage('Deploy') {
            steps {
                sh "${COMPOSE} up -d --remove-orphans"
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    for i in $(seq 1 15); do
                        if curl -sf http://${APP_HOST}:4000/api/health > /dev/null && curl -sf http://${APP_HOST}:80 > /dev/null; then
                            echo "Deployment healthy."
                            exit 0
                        fi
                        echo "Waiting for services to come up... ($i/15)"
                        sleep 4
                    done
                    echo "Services did not become healthy in time."
                    exit 1
                '''
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed — check the stage logs above.'
        }
        success {
            echo 'Communa deployed successfully. Live at http://localhost'
        }
    }
}
