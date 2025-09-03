pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '1', daysToKeepStr: '2')) // Discard builds
    }

    environment {
        // Set the GitHub URL
        REPO_URL = 'https://github.com/ssitRepo/ssit-login.git'
        
        // Updated deploy path directly to the html folder
        DEPLOY_PATH = "C:/nginx-1.26.2/html"
    }

    tools {
        nodejs 'node'
    }

    triggers {
        pollSCM('* * * * *') // Poll the SCM every minute
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Echo the repository URL to verify
                    echo "Repository URL: ${env.REPO_URL}"

                    // Fetch the branch name from the environment variable
                    def branchName = "${env.BRANCH_NAME}"

                    // Validate if branch name is set
                    if (branchName == null || branchName.isEmpty()) {
                        error "BRANCH_NAME is not set. Please provide a valid branch name."
                    }

                    // Checkout the specific branch from the correct repository
                    git branch: branchName, 
                        url: "${REPO_URL}", // Use the specified repository URL
                        credentialsId: 'github'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    bat '''
                        @echo off
                        set CI=false
                        if not exist "node_modules" (
                            npm install
                        ) else (
                            echo node_modules directory exists, skipping npm install.
                        )
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                bat '''
                    @echo off
                    set CI=false
                    npm run build
                '''
            }
        }

        stage('Stop NGINX') {
            steps {
                script {
                    def nginxStatus = bat(script: 'sc query nginx', returnStdout: true).trim()
                    if (nginxStatus.contains("STOPPED")) {
                        echo 'NGINX is already stopped.'
                    } else {
                        bat 'net stop nginx'
                    }
                }
            }
        }

        stage('Deploy to NGINX') {
            steps {
                script {
                    // Check if the deployment path exists before attempting to remove it
                    def deployPathExists = bat(script: "if exist \"${DEPLOY_PATH}\" (exit 0) else (exit 1)", returnStatus: true)
                    
                    if (deployPathExists == 0) {
                        bat "rmdir /S /Q \"${DEPLOY_PATH}\""
                    } else {
                        echo "Deployment path does not exist, skipping rmdir."
                    }

                    // Create the new deployment directory
                    bat "mkdir \"${DEPLOY_PATH}\""
                    
                    // Use the correct syntax for xcopy
                    bat "xcopy /E /I /Y \"build\\*\" \"${DEPLOY_PATH}\""
                }
            }
        }

        stage('Start NGINX') {
            steps {
                script {
                    def nginxStatus = bat(script: 'sc query nginx', returnStdout: true).trim()
                    if (nginxStatus.contains("RUNNING")) {
                        echo 'NGINX is already running.'
                    } else {
                        bat 'net start nginx'
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                echo "Deployment completed successfully."
            }
        }
        failure {
            echo "Deployment of branch ${env.BRANCH_NAME} failed. Check logs."
        }
    }
}
