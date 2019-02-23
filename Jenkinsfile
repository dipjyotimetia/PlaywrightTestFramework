pipeline {
    // agent { 
    //     dockerfile {
    //         filename 'Dockerfile'
    //         args '--privileged'
    //     } 
    // }

    stages {
        stage('Dependencies') {
            steps {
                sh 'npm i'
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
                sh 'npm test'
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

    // post {
    //   always {
    //           script {
    //               allure([
    //                   includeProperties: false,
    //                   jdk: '',
    //                   properties: [],
    //                   reportBuildPolicy: 'ALWAYS',
    //                   results: [[path: 'allure-results']]
    //               ])
    //           }
    //         }
    // }
}
