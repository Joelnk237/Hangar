# ─────────────────────────────────────────────
# Stage 1 — build Maven
# ─────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copier le pom.xml en premier pour profiter du cache Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et compiler
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─────────────────────────────────────────────
# Stage 2 — image finale (JRE léger)
# ─────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Utilisateur non-root
RUN addgroup --system --gid 1001 vertx \
 && adduser  --system --uid 1001 vertx

# Copier le fat-jar généré par Maven (Vert.x crée un uber-jar)
COPY --from=builder /app/target/*-fat.jar app.jar

USER vertx
EXPOSE 8888

# Options JVM recommandées pour conteneur
CMD ["java", \
     "-XX:+UseContainerSupport", \
     "-XX:MaxRAMPercentage=75.0", \
     "-jar", "app.jar"]
