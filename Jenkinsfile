pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    environment {
        IMAGE_NAME = "aimoodtracker"
        IMAGE_TAG = "${BUILD_NUMBER}"
        ECR_REPO = "833822973078.dkr.ecr.eu-north-1.amazonaws.com/aimoodtracker"
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

        stage('Build Docker Image') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Push to ECR') {
        steps {
            bat '''
            "C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe" ecr get-login-password --region eu-north-1 | "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" login --username AWS --password-stdin 833822973078.dkr.ecr.eu-north-1.amazonaws.com
            
            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" tag aimoodtracker:%BUILD_NUMBER% 833822973078.dkr.ecr.eu-north-1.amazonaws.com/aimoodtracker:%BUILD_NUMBER%
            
            "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push 833822973078.dkr.ecr.eu-north-1.amazonaws.com/aimoodtracker:%BUILD_NUMBER%
            '''
        }
    }

        stage('Deploy ECS') {
            steps {
                bat '''
                "C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe" ecs update-service ^
                --cluster aimoodtracker-cluster ^
                --service aimoodtracker-service ^
                --force-new-deployment ^
                --region eu-north-1
                '''
            }
        }
    }
}