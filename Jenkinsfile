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
          bat 'npm coverage'
              script {
                  allure([
                      includeProperties: false,
                      jdk: '',
                      properties: [],
                      reportBuildPolicy: 'ALWAYS',
                      results: [[path: 'allure-results']]
                  ])
              }
                publishHTML target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: false,
                    reportDir: 'coverage/lcov-report',
                    reportFiles: 'index.html',
                    reportName: 'Coverage Report'
                ]

      }
    }
}
