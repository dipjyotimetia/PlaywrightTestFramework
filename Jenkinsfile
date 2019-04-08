pipeline {
    
    agent { dockerfile true }
    
     stages {
        stage('Test') {
            steps {
                sh "docker build -t accountownerapp:B${BUILD_NUMBER} -f Dockerfile ."
                sh "docker run --privileged:B${BUILD_NUMBER}"
            }
        }
    }
}