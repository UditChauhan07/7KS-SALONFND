node {
     def app 
     stage('clone repository') {
     checkout scm  
     }
     stage('Build docker Image'){
     app = docker.build("uditchauhan07/nt-3")
     }
     stage('Test Image'){
     app.inside {
     sh 'echo "TEST PASSED"'
          }  
     }
     stage('Push Image'){
     docker.withRegistry('https://registry.hub.docker.com','dockerhub'){            
     app.push("${env.BUILD_NUMBER}")            
     app.push("Salon")   
          }
     }
}
