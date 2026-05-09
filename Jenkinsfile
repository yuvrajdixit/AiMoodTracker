pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    environment {
        IMAGE_NAME = "aimoodtracker"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npx vitest run'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        bat """
                        C:\\sonar-scanner-5.0.1.3006-windows\\bin\\sonar-scanner.bat ^
                        -Dsonar.token=%SONAR_TOKEN%
                        """
                    }
                }
            }
        }

        stage('Build App') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Check Docker') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" --version'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }
    }
}