# Instrucciones para ejecutar el proyecto

## Requisitos previos

- Node.js
- Docker y Docker Compose
- Npm

## Arquitectura del sistema

El sistema utiliza una arquitectura de microservicios con comunicación asíncrona a través de Kafka:

1. **Transaction-service**:
   - Implementa un patrón CQRS (Command Query Responsibility Segregation)
   - Expone una API GraphQL para crear y consultar transacciones
   - Almacena datos en PostgreSQL usando TypeORM
   - Publica eventos de transacciones creadas a Kafka
   - Escucha eventos de transacciones validadas desde Kafka

2. **Anti-fraud-service**:
   - Escucha eventos de transacciones creadas desde Kafka
   - Aplica reglas de negocio para validar transacciones
   - Publica eventos de transacciones validadas a Kafka

3. **Infraestructura**:
   - PostgreSQL: Base de datos relacional para almacenar transacciones
   - Kafka: Sistema de mensajería para comunicación asíncrona entre servicios
   - Zookeeper: Requerido por Kafka para gestión de configuración

## Configuración de variables de entorno

Cada servicio requiere su propio archivo .env. Puedes usar los archivos .env.example como plantilla:

```bash
# Para transaction-service
cp transaction-service/.env.example transaction-service/.env

# Para anti-fraud-service
cp anti-fraud-service/.env.example anti-fraud-service/.env
```

## Pasos para ejecutar

1. **Instalar dependencias**:

   ```bash
   # En la carpeta transaction-service
   cd transaction-service
   npm install

   # En la carpeta anti-fraud-service
   cd anti-fraud-service
   npm install
   ```

2. **Iniciar servicios**:

   ```bash
   # Iniciar Postgres, Kafka y Zookeeper
   docker-compose up -d

   # Iniciar transaction-service
   cd transaction-service
   npm run start

   # En otra terminal, iniciar anti-fraud-service
   cd anti-fraud-service
   npm run start
   ```

3. **Ejecutar seeders**:

   Para cargar datos iniciales de tipos de transacción en la base de datos:

   ```bash
   # En la carpeta transaction-service
   cd transaction-service
   npm run seed
   ```

   Este comando creará los siguientes tipos de transacción:
   - TRANSFER
   - DEPOSIT
   - PAYMENT
   - REFUND
   - CHARGE
   - SUBSCRIPTION
   - INTERNATIONAL_TRANSFER

4. **Acceder a la API GraphQL**:

   Una vez que los servicios estén en ejecución, puedes acceder al playground de GraphQL en:
   
   http://localhost:3000/graphql

## Ejemplos de uso

### Crear una transacción

```graphql
mutation {
  createTransaction(input: {
    accountExternalIdDebit: "RANDOM_UUID",
    accountExternalIdCredit: "RANDOM_UUID",
    transferTypeId: "UUID-GENERADO-POR-SEEDER",
    value: 500
  })
}
```

### Consultar una transacción

```graphql
query {
  getTransaction(id: "TRANSACTION_ID") {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
```
