def buildTag = "1.0.${BUILD_NUMBER}"
def buildBranch = 'main'

pipeline {
    agent { label 'my-pc' }

    environment {
        PROJECT_NAME = 'my-app' // Cambia este valor según el proyecto
        SSH_CREDENTIALS_ID = 'APP_SSH'
        GITHUB_SSH_CREDENTIALS_ID = 'github-ssh-key'
        GIT_REPO_URL = 'git@github.com:germanfica/my-login-app-api-jwt-backend.git'
        REPO_DIR = 'my-login-app-api-jwt-backend'
        APP_IMAGE_TAG = 'latest'
        PATH = "C:\\Program Files\\Git\\bin;${env.PATH}"
    }

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Setup parameters') {
            agent { label 'my-pc' }
            steps {
                script {
                    properties([
                        parameters([
                            string(name: 'APP_IMAGE_NAME', defaultValue: 'my-login-app-api', description: 'Nombre de la imagen de la aplicación Docker'),
                            choice(
                                choices: ['tag', 'main'],
                                name: 'GIT_BRANCH'
                            ),
                            gitParameter (
                                branch: buildBranch, branchFilter: '.*', defaultValue: '',
                                description: 'Select a git tag to use in this build. This parameter requires the git-parameter plugin.',
                                name: 'GIT_TAG', quickFilterEnabled: false, selectedValue: 'NONE', sortMode: 'NONE', tagFilter: '*', type: 'PT_TAG'
                            )
                        ])
                    ])
                }
            }
        }

        stage('Check parameters') {
            agent { label 'my-pc' }
            steps {
                script {
                    if(params.GIT_BRANCH.toString().equals('tag')){
                        if(params.GIT_TAG == null || params.GIT_TAG.toString().isEmpty()) {
                            currentBuild.result = 'ABORTED';
                            error("GIT_TAG is empty")
                        } else {
                            buildTag = params.GIT_TAG.toString()
                            buildBranch = params.GIT_TAG.toString()
                        }
                    }
                    if(params.GIT_BRANCH == null || params.GIT_BRANCH.toString().isEmpty()) {
                        currentBuild.result = 'ABORTED';
                        error("GIT_BRANCH is empty")
                    }
                    echo "Build tag: ${buildTag}"
                }
            }
        }

        stage('Checkout') {
            agent { label 'my-pc' }
            steps {
                checkout([$class: 'GitSCM', branches: [[name: buildBranch]],
                          doGenerateSubmoduleConfigurations: false,
                          extensions: [],
                          gitTool: 'Default',
                          userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: 'github-ssh-key']]])
                echo 'Checkout completed. Proceeding to the next stage.'
            }
        }

        stage('Create .env file for Docker Build') {
            agent { label 'my-pc' }
            steps {
                withCredentials([file(credentialsId: 'my-login-app-api.env', variable: 'SECRET_ENV_FILE')]) {
                    script {
                        def envContent = readFile SECRET_ENV_FILE
                        writeFile file: ".env", text: envContent
                        echo ".env file created locally for Docker build."
                    }
                }
            }
        }

        stage('Build Docker Image') {
            agent { label 'my-pc' }
            steps {
                script {
                    //bat "docker-compose build"
                    bat "docker build -t ${params.APP_IMAGE_NAME} -f Dockerfile ."
                    echo "Docker image created successfully"
                }
            }
        }

        stage('Save Docker Image with tag latest') {
            agent { label 'my-pc' }
            steps {
                script {
                    bat "docker save ${params.APP_IMAGE_NAME}:${APP_IMAGE_TAG} -o ${params.APP_IMAGE_NAME}-${APP_IMAGE_TAG}.tar"
                    echo "Docker image ${params.APP_IMAGE_NAME}:${APP_IMAGE_TAG} saved as ${params.APP_IMAGE_NAME}-${APP_IMAGE_TAG}.tar"
                }
            }
        }

        stage('Re-tag Docker Image') {
            agent { label 'my-pc' }
            steps {
                script {
                    bat "docker tag ${params.APP_IMAGE_NAME}:${APP_IMAGE_TAG} ${params.APP_IMAGE_NAME}:${buildTag}"
                    echo "Docker image ${params.APP_IMAGE_NAME}:${APP_IMAGE_TAG} renamed as ${params.APP_IMAGE_NAME}:${buildTag}"
                }
            }
        }

        stage('Save the renamed Docker Image with tag number') {
            agent { label 'my-pc' }
            steps {
                script {
                    bat "docker save ${params.APP_IMAGE_NAME}:${buildTag} -o ${params.APP_IMAGE_NAME}-v${buildTag}.tar"
                    echo "Docker image ${params.APP_IMAGE_NAME}:${buildTag} saved as ${params.APP_IMAGE_NAME}-v${buildTag}.tar"
                }
            }
        }

        stage('Upload docker image to the server') {
            agent { label 'my-pc' }
            steps {
                withCredentials([
                    string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'),
                    string(credentialsId: 'SSH_USERNAME', variable: 'SSH_USERNAME'),
                    string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
                ]) {
                    bat """
                        scp -P %SSH_PORT% ${params.APP_IMAGE_NAME}-v${buildTag}.tar %SSH_USERNAME%@%SSH_HOST%:~/${params.APP_IMAGE_NAME}-v${buildTag}.tar
                    """
                }
            }
        }

        stage('Clean Up Local Image') {
            agent { label 'my-pc' }
            steps {
                script {
                    bat "docker rmi ${params.APP_IMAGE_NAME}:${APP_IMAGE_TAG} -f"
                    bat "docker rmi ${params.APP_IMAGE_NAME}:${buildTag} -f"
                    echo "Docker images ${params.APP_IMAGE_NAME}:${APP_IMAGE_TAG} and ${params.APP_IMAGE_NAME}:${buildTag} removed locally."
                }
            }
        }

        stage('Load docker image to the server') {
            agent { label 'my-pc' }
            steps {
                withCredentials([
                    string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'),
                    string(credentialsId: 'SSH_USERNAME', variable: 'SSH_USERNAME'),
                    string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
                ]) {
                    bat """
                        ssh -o StrictHostKeyChecking=no -p %SSH_PORT% %SSH_USERNAME%@%SSH_HOST% "docker load -i ${params.APP_IMAGE_NAME}-v${buildTag}.tar"
                        ssh -o StrictHostKeyChecking=no -p %SSH_PORT% %SSH_USERNAME%@%SSH_HOST% "docker images"
                    """
                }
            }
        }

        stage('Modify docker-compose-image-template.yml') {
            agent { label 'my-pc' }
            steps {
                script {
                    // Lee el contenido del archivo docker-compose-image-template.yml
                    def dockerComposeTemplate = readFile 'docker-compose-image-template.yml'

                    // Reemplaza 'tu-imagen-hash' con '${env.APP_IMAGE_NAME}:${buildTag}'
                    def dockerComposeContent = dockerComposeTemplate
                        .replaceAll('app-image-name', "${env.APP_IMAGE_NAME}:${buildTag}")
                        .replaceAll('app-container-name', "${env.APP_IMAGE_NAME}")

                    // Escribe el contenido modificado en un nuevo archivo
                    def outputComposeFile = "${env.APP_IMAGE_NAME}-docker-compose.yml"
                    writeFile file: outputComposeFile, text: dockerComposeContent

                    echo "Content successfully modified:\n${dockerComposeContent}"
                }
            }
        }

        stage('Upload docker-compose.yml to the server') {
            agent { label 'my-pc' }
            steps {

                withCredentials([
                    // No te olvides de agregar estos IDs en tus credenciales de tipo Secret text
                    string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'), // Secret text: puerto de tu servidor SSH
                    string(credentialsId: 'SSH_USERNAME', variable: 'SSH_USERNAME'), // Secret text: usuario de tu servidor SSH
                    string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST') // Secret text: IP de tu servidor SSH
                ]) {
                    bat """
                        scp -P %SSH_PORT% ${env.APP_IMAGE_NAME}-docker-compose.yml %SSH_USERNAME%@%SSH_HOST%:~/${env.APP_IMAGE_NAME}-docker-compose.yml
                    """
                }
            }
        }

        // stage('Export environment variables on Server') {
        //     agent { label 'my-pc' }
        //     steps {
        //         withCredentials([file(credentialsId: 'my-login-app-api.env', variable: 'SECRET_ENV_FILE')]) {
        //             script {
        //                 // Lee el archivo .env y convierte cada línea en una variable
        //                 def envVars = readFile(SECRET_ENV_FILE).split('\n')

        //                 // Construye el comando export para cada variable en el servidor
        //                 def exportCommands = envVars.collect { line ->
        //                     if (line.trim()) {
        //                         return "export ${line.trim()}"
        //                     }
        //                 }.join(' && ')

        //                 // Ejecuta el comando en el servidor
        //                 withCredentials([
        //                     string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'),
        //                     string(credentialsId: 'SSH_USERNAME', variable: 'SSH_USERNAME'),
        //                     string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
        //                 ]) {
        //                     bat """
        //                         ssh -o StrictHostKeyChecking=no -p %SSH_PORT% %SSH_USERNAME%@%SSH_HOST% "${exportCommands} && echo 'Environment variables set successfully.'"
        //                     """
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Export environment variable on Server') {
        //     agent { label 'my-pc' }
        //     steps {
        //         withCredentials([
        //             string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'),
        //             string(credentialsId: 'SSH_USERNAME', variable: 'SSH_USERNAME'),
        //             string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
        //         ]) {
        //             script {
        //                 // Define el comando para exportar una sola variable
        //                 def exportCommand = "export DB_NAME=myloginapp"

        //                 // Ejecuta el comando en el servidor
        //                 bat """
        //                     ssh -o StrictHostKeyChecking=no -p %SSH_PORT% %SSH_USERNAME%@%SSH_HOST% "${exportCommand} && echo 'DB_NAME set successfully.'"
        //                 """
        //             }
        //         }
        //     }
        // }

        // Se está intentando ejecutar docker-compose sin necesidad de usar .env file
        stage('Export environment variable on Server (Experimental)') {
            agent { label 'my-pc' }
            steps {
                withCredentials([
                    string(credentialsId: 'SSH_PORT', variable: 'SSH_PORT'),
                    string(credentialsId: 'SSH_USERNAME', variable: 'SSH_USERNAME'),
                    string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
                ]) {
                    script {
                        // Define el comando export y docker-compose en una línea
                        def exportCommand = "export DB_NAME=myloginapp && docker-compose -p ${env.APP_IMAGE_NAME} -f ${env.APP_IMAGE_NAME}-docker-compose.yml up -d"

                        // Ejecuta el comando en el servidor sin comillas exteriores
                        bat """
                            ssh -o StrictHostKeyChecking=no -p %SSH_PORT% %SSH_USERNAME%@%SSH_HOST% ${exportCommand} && echo DB_NAME set successfully.
                        """
                    }
                }
            }
        }

    }
}
