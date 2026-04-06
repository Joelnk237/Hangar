# Jenkins avec Docker CLI intégré
# Permet à Jenkins de builder des images Docker directement
FROM jenkins/jenkins:2.452-lts-jdk21

USER root

# Installer Docker CLI (pour builder les images depuis les pipelines)
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
 && curl -fsSL https://download.docker.com/linux/debian/gpg \
      | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
 && echo "deb [arch=$(dpkg --print-architecture) \
      signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
      https://download.docker.com/linux/debian \
      $(lsb_release -cs) stable" \
      > /etc/apt/sources.list.d/docker.list \
 && apt-get update && apt-get install -y docker-ce-cli \
 && rm -rf /var/lib/apt/lists/*

# Ajouter jenkins au groupe docker
RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins

# Pré-installer les plugins Jenkins essentiels
RUN jenkins-plugin-cli --plugins \
    git \
    github \
    pipeline-stage-view \
    docker-workflow \
    sonar \
    junit \
    jacoco \
    blueocean \
    credentials-binding