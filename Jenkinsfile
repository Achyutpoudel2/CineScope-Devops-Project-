pipeline {

  agent any

  environment {
    DOCKER = "/usr/local/bin/docker"
    KUBECTL = "/usr/local/bin/kubectl"
    IMAGE = "yash374/cinescope"
    TAG = "${env.BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Fix Docker Config') {
      steps {
        sh '''
        mkdir -p ~/.docker
        echo '{}' > ~/.docker/config.json
        '''
      }
    }

    stage('Verify Tools') {
      steps {
        sh "${DOCKER} --version"
        sh "${KUBECTL} version --client || true"
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh """
          echo \$DOCKER_PASS | ${DOCKER} login -u \$DOCKER_USER --password-stdin
          """
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """
        export DOCKER_CONFIG=/tmp
        ${DOCKER} build -t ${IMAGE}:${TAG} .
        """
      }
    }

    stage('Push to Docker Hub') {
      steps {
        sh """
        ${DOCKER} push ${IMAGE}:${TAG}
        ${DOCKER} tag ${IMAGE}:${TAG} ${IMAGE}:latest
        ${DOCKER} push ${IMAGE}:latest
        """
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh "${KUBECTL} apply -f k8s/deployment.yaml"
        sh "${KUBECTL} apply -f k8s/service.yaml"
        sh "${KUBECTL} set image deployment/cinescope-deployment cinescope=${IMAGE}:${TAG} --record || true"
      }
    }

  }

  post {
    always {
      echo "✅ Completed build ${env.BUILD_NUMBER}"
    }
  }

}
