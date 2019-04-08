pipeline {
    
    agent { dockerfile true }

    stage 'Checkout'
        checkout scm
    stage 'Build & UnitTest'
    sh "docker build -t accountownerapp:B${BUILD_NUMBER} -f Dockerfile ."

    stage 'Test'
    sh "docker run --privileged:B${BUILD_NUMBER}"
}