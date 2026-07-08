Instead of memorizing the code, learn the **thinking process**. Every interceptor follows the same pattern.

---

# Step 1: Decide why you need an Interceptor

Ask yourself:

> **What do I want to do before or after every controller?**

Examples:

* Global response format
* Log API execution time
* Cache responses
* Transform returned data
* Add metadata

If the answer is "I want to wrap the controller execution," an interceptor is the right choice.

---

# Step 2: Create an Interceptor

Using the CLI:

```bash
nest g interceptor common/interceptors/response
```

Or create a file manually:

```text
src/
└── common/
    └── interceptors/
        └── response.interceptor.ts
```

---

# Step 3: Implement `NestInterceptor`

```ts
import { Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {}
```

At this point, Nest recognizes it as an interceptor.

---

# Step 4: Implement the `intercept()` Method

Every interceptor must implement:

```ts
intercept(context, next) {}
```

You'll usually write:

```ts
intercept(context, next) {
    return next.handle();
}
```

Think of it as:

```text
Receive Request
       │
       ▼
Interceptor
       │
       ▼
next.handle()
       │
       ▼
Controller
```

---

# Step 5: Add Logic Before the Controller

Anything before `next.handle()` runs **before** the controller.

Example:

```ts
intercept(context, next) {

    console.log("Before Controller");

    return next.handle();
}
```

Flow:

```text
Request

↓

Interceptor

↓

console.log()

↓

Controller
```

---

# Step 6: Add Logic After the Controller

The controller returns an **Observable**, so use RxJS operators.

Example:

```ts
return next.handle().pipe(
    map((data) => {
        console.log("After Controller");

        return data;
    }),
);
```

Flow:

```text
Controller

↓

Returns Data

↓

map()

↓

Client
```

---

# Step 7: Modify the Response (Optional)

You can return something different.

Controller:

```ts
return user;
```

Interceptor:

```ts
return next.handle().pipe(
    map((data) => ({
        success: true,
        data,
    })),
);
```

The client receives:

```json
{
  "success": true,
  "data": {}
}
```

The controller didn't change.

---

# Step 8: Register the Interceptor

### Global

`main.ts`

```ts
app.useGlobalInterceptors(new ResponseInterceptor());
```

Runs for every request.

---

### Controller Level

```ts
@UseInterceptors(ResponseInterceptor)
@Controller('users')
export class UsersController {}
```

Runs only for this controller.

---

### Route Level

```ts
@Get()
@UseInterceptors(ResponseInterceptor)
findAll() {}
```

Runs only for this route.

---

# Step 9: Test It

Add logs:

```ts
intercept(context, next) {

    console.log("Before");

    return next.handle().pipe(

        tap(() => {
            console.log("After");
        }),

    );

}
```

Controller:

```ts
@Get()
findAll() {

    console.log("Controller");

    return [];
}
```

Console output:

```text
Before

Controller

After
```

Now you've verified that your interceptor wraps the controller.

---

# The Mental Model

Whenever you build an interceptor, think in this order:

```text
1. Receive Request
        │
        ▼
2. Do something BEFORE the controller
        │
        ▼
3. Call next.handle()
        │
        ▼
4. Wait for the controller to finish
        │
        ▼
5. Receive the controller's return value
        │
        ▼
6. Modify or inspect the result
        │
        ▼
7. Return the final response
```

---

# Skeleton You Can Reuse

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MyInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    // Before controller
    console.log('Before');

    return next.handle();

    // Or:
    // return next.handle().pipe(
    //   map((data) => {
    //     // After controller
    //     return data;
    //   }),
    // );
  }
}
```

## Rule to remember

Every custom interceptor is built around these three questions:

1. **What should happen before the controller?** (logging, start timer, inspect request)
2. **Should I let the request continue?** (`return next.handle()`)
3. **What should happen after the controller returns?** (transform response, stop timer, cache, log result)

If you answer those three questions, you can build almost any NestJS interceptor.
