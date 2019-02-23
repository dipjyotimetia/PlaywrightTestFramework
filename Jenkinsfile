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
                sleep 20
                echo 'building....'
            }
        }
        stage('UnitTest') {
            steps {
                sleep 30
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
                sleep 40
                echo 'PerformanceTest....'
            }
        }
        stage('DeployToProd') {
            steps {
                sleep 50
                echo 'Deploying....'
            }
        }
    }

    post {
      always {
              script {
                  allure([
                      includeProperties: false,
                      jdk: '',
                      properties: [],
                      reportBuildPolicy: 'ALWAYS',
                      results: [[path: 'allure-results']]
                  ])
              }
              stage('Publish test results') {
                    junit 'reports/*.xml'
                } 
            }
    }
}