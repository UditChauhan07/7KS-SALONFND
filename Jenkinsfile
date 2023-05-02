node {
     def app 
     stage('clone repository') {
     checkout scm  
     }
     stage('Build docker Image'){
     app = docker.build("uditchauhan07/salonfnd")
     }
     stage('Test Image'){
     app.inside {
     sh 'echo "Test Image Passed"'
          }  
     }
     stage('Push Image'){
     docker.withRegistry('https://registry.hub.docker.com','dockerhub'){            
     app.push("${env.BUILD_NUMBER}")            
     app.push("Salon")   
          }
     }
}
//  checkout scm

    // docker.withRegistry('https://registry.hub.docker.com','dockerhub'){

    //     def customImage = docker.build("my-image:${env.BUILD_NUMBER}")

    //     /* Push the container to the custom Registry */
    //     customImage.push()
    // }
