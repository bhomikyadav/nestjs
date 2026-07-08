# NestJS Tutorial Learning Guide

This README is written as a step-by-step learning note for this NestJS project. It explains the main steps, commands, and concepts used while building the application.

---

## 1. Create a new NestJS project

If you are starting fresh, run one of these commands:

```bash
nest new project-name
```

Or if you are creating the project in the current folder:

```bash
nest new .
```

This will generate a basic NestJS structure with:
- `src/main.ts` for app bootstrap
- `src/app.module.ts` for the root module
- `src/app.controller.ts` and `src/app.service.ts` for a basic controller and service

---

## 2. Install dependencies

This project uses the following important packages:

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/mongoose mongoose reflect-metadata rxjs
```

Development tools:

```bash
npm install -D @nestjs/cli @nestjs/schematics @nestjs/testing typescript ts-node ts-jest jest supertest eslint prettier
```

---

## 3. Understand the basic project structure

A typical NestJS project contains:

- `src/main.ts` → starts the application
- `src/app.module.ts` → root module that brings everything together
- `src/app.controller.ts` → handles incoming requests
- `src/app.service.ts` → contains business logic

In this project, the structure is expanded with custom modules:

- `src/auth/` → authentication-related module
- `src/users/` → user-related module
- `src/users/schemas/` → MongoDB schema definitions

---

## 4. Create modules in NestJS

Modules are used to organize features.

You can create a module using:

```bash
nest g module auth
nest g module users
```

Each module is registered in the main app module.

Example:

- `src/auth/auth.module.ts`
- `src/users/users.module.ts`

This helps keep the application clean and scalable.

---

## 5. Create controllers and services

Controllers handle requests, while services contain the logic.

Generate them with:

```bash
nest g controller auth
nest g service auth

nest g controller users
```

### Important idea
- Controller: receives the request and returns a response
- Service: performs logic or interacts with data

This project shows that pattern through the `auth` and `users` folders.

### What the current services are doing

In this project, the services already contain important logic:

- `AppService.getHello()` returns the string `Hello World!` for the basic app route.
- `AuthService.create()` handles user registration.
- Before saving a user, it checks whether the email already exists.
- It uses `bcrypt` to hash the password before storing it in MongoDB.
- If the user is saved successfully, it creates a JWT token using `JWT_SECRET_KEY`.
- The token payload contains the user's `guid` and `email` and expires in 5 minutes.
- If the email already exists, the service throws a `ConflictException`.
- If the save operation fails, it throws an `InternalServerErrorException`.

The controller exposes this flow through `POST /auth/register`.

---

## 6. Create DTOs (Data Transfer Objects)

DTOs define the shape of request data.

In this project, you can find DTO files in:

- `src/auth/dto/create-auth.dto.ts`
- `src/auth/dto/update-auth.dto.ts`

DTOs are useful for:
- validating incoming data
- keeping code structured
- making APIs easier to understand

---

## 7. Connect MongoDB with Mongoose

This project is configured to use MongoDB.

### Steps used
1. Install Mongoose and NestJS Mongoose
2. Add `ConfigModule` for environment variable support
3. Use `MongooseModule.forRootAsync()` inside `src/app.module.ts`
4. Define a schema in `src/users/schemas/user.schema.ts`
5. Inject the model into the auth service using `@InjectModel(User.name)`

### Environment variable example
Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/nest-tutorial
PORT=3000
JWT_SECRET_KEY=your_secret_key_here
```

This makes your app flexible and safe for configuration.

### Important database note
The auth flow uses MongoDB to save user records and the application expects the database connection to be available before authentication requests are processed.

---

## 8. Run the application

To start the app in development mode:

```bash
npm run start:dev
```

Then open:

```text
http://localhost:3000
```

If you want to build the project:

```bash
npm run build
```

---

## 9. Run tests

NestJS comes with Jest support.

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

This helps verify that your application is working correctly.

---

## 10. Useful commands for learning

```bash
npm run start:dev
npm run build
npm run test
npm run lint
npm run format
```

These commands are useful when you want to practice the development flow repeatedly.

---

## 11. What this project teaches

By studying this project, you will learn:

- how NestJS applications are structured
- how modules, controllers, and services work together
- how to create routes and logic
- how to organize feature-based folders
- how to connect to MongoDB using Mongoose
- how to hash passwords and register users securely
- how to generate and use JWT tokens
- how to run and test a NestJS app

---

## 12. Future learning steps

If you want to continue learning, the next steps could be:

1. Add proper validation with `class-validator`
2. Add authentication and authorization
3. Create a real CRUD API for users
4. Add Swagger documentation
5. Connect to a real database in production
6. Learn about guards, interceptors, and middleware

---

## 13. Quick summary

This project is a beginner-friendly NestJS example that shows:
- project setup
- module creation
- controller and service structure
- database connection
- testing and running the app

Keep practicing by adding small features step by step.
