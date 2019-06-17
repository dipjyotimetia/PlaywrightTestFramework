pipeline {
    agent any
//agent {
    	//docker {
			//image 'puppeteer:latest'
      		//args '--privileged'
    	//}
  	//}
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
              junit 'reports/*.xml'
	      publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'reports', reportFiles: 'report.html', reportName: 'WebUi Test Report', reportTitles: ''])
              script {
                  allure([
                      includeProperties: false,
                      jdk: '',
                      properties: [],
                      reportBuildPolicy: 'ALWAYS',
                      results: [[path: 'allure-results']]
                  ])
                }
               
        }
    }
}
