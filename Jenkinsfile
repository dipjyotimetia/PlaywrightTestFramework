pipeline {
    agent any

    stages {
        stage('Dependencies') {
            steps {
                bat 'npm i'
            }
        }
        stage('Build') {
            steps {
                echo 'building....'
            }
        }
        stage('UnitTest') {
            steps {
                echo 'UnitTest....'
            }
        }
        stage('E2E Tests') {
            steps {
                bat 'npm test'
            }
        }
        stage('PerformanceTest') {
            steps {
                echo 'PerformanceTest....'
            }
        }
        stage('DeployToProd') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
