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
- `AuthService.create(createAuthDto)` handles user registration.
  - It checks whether an account with the same email already exists by querying the MongoDB model.
  - If the email is already registered, it throws `ConflictException` with the message `Email already present`.
  - It hashes the password using `bcrypt` with a salt value of `6` before saving the user.
  - It stores the user in MongoDB using the injected `UserModel`.
  - After saving successfully, it creates a JWT token using `JWT_SECRET_KEY`.
  - The token payload contains the user's `guid` and `email`, and it expires in 5 minutes.
  - If the user save fails, it throws `InternalServerErrorException` with the message `Server Error!!`.
- `AuthService.findAll()`, `findOne()`, `update()`, and `remove()` are currently placeholder methods that return simple example strings.

The controller exposes the registration flow through `POST /auth/register` and also provides basic placeholder endpoints for `GET /auth`, `GET /auth/:id`, `PATCH /auth/:id`, and `DELETE /auth/:id`.

---

## 6. Create DTOs (Data Transfer Objects)

DTOs define the shape of request data.

In this project, you can find DTO files in:

- `src/auth/dto/create-auth.dto.ts`
- `src/auth/dto/update-auth.dto.ts`

The current `CreateAuthDto` includes these fields:

- `name` → required string
- `email` → required email
- `password` → required strong password
- `age` → required number

These fields are used by the registration endpoint and help validate incoming request data before the service processes it.

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

### User schema details
The `User` schema contains:
- `name` as a required string
- `email` as a required string
- `age` as a required number
- `password` as a required string
- `guid` as a generated UUID value with a default function

The schema is configured with timestamps enabled.

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

### Example registration request

You can test the registration endpoint with a request like this:

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Abcd1234!",
  "age": 25
}
```

If the registration is successful, the API returns a JWT token in the response.

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
- how to validate incoming request data with DTOs
- how to hash passwords and register users securely
- how to generate and use JWT tokens
- how to define schemas and auto-generate UUID values
- how to run and test a NestJS app

---

## 12. Server startup and bootstrap flow

The application starts from `src/main.ts`.

### What happens when the server starts
1. Nest creates the application from `AppModule`.
2. A global prefix `api` is applied to all routes.
3. Global validation is enabled using `ValidationPipe`.
4. A global exception filter is registered for consistent error responses.
5. A global response interceptor is registered to standardize successful responses.
6. The application listens on `process.env.PORT` or port `3000`.

### Important startup behavior
- All routes are prefixed with `/api`.
- Validation errors are handled globally.
- Every successful response is wrapped in a standard structure.
- Errors are returned with a consistent JSON format.

---

## 13. Global exception handling

The project contains a global exception filter in `src/common/filters/all-exceptions/all-exceptions.filter.ts`.

### Purpose
This filter catches unhandled exceptions and returns a clear JSON response.

### What it returns
A typical error response looks like:

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Something Went Wrong",
  "requestId": "...",
  "timestamp": "..."
}
```

### Why it is useful
- Keeps error responses consistent
- Makes debugging easier
- Prevents raw exception details from leaking everywhere

---

## 14. Global response formatting

The response interceptor in `src/common/interceptors/response/response.interceptor.ts` formats successful responses.

### Response shape
Successful responses are wrapped like this:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request is Completed",
  "data": {},
  "timestamp": "...",
  "requestId": "..."
}
```

### Why it is useful
- Gives every successful response a consistent structure
- Makes frontend integration easier
- Helps standardize API behavior

---

## 15. Request context and request ID

The project includes a request context service and middleware to track request-specific information.

### Files involved
- `src/common/request-context/request-context.service.ts`
- `src/common/request-context/request-context.middleware.ts`

### Purpose
This is used to attach a `requestId` to each request so it can be logged or returned in API responses.

### Learning point
This is a common pattern in real-world APIs when you want to trace requests across logs, errors, and responses.

---

## 16. Current API routes

Because the app uses a global prefix, the routes are available under `/api`.

### App route
- `GET /api` → returns `Hello World!`

### Auth routes
- `POST /api/auth/register` → registers a new user
- `GET /api/auth` → placeholder route
- `GET /api/auth/:id` → placeholder route
- `PATCH /api/auth/:id` → placeholder route
- `DELETE /api/auth/:id` → placeholder route

---

## 17. Future learning steps

If you want to continue learning, the next steps could be:

1. Add proper validation with `class-validator`
2. Add authentication and authorization
3. Create a real CRUD API for users
4. Add Swagger documentation
5. Connect to a real database in production
6. Learn about guards, interceptors, and middleware
7. Improve request context handling for async flows
8. Add logging and monitoring

---

## 18. Quick summary

This project is a beginner-friendly NestJS example that shows:
- project setup
- module creation
- controller and service structure
- database connection
- request validation
- password hashing and JWT creation
- global exception handling
- response formatting
- request tracing with request IDs

Keep practicing by adding small features step by step.
