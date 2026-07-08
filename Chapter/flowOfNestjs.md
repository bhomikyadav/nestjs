                    HTTP Request
                         │
                         ▼
               Express/Fastify Adapter
                         │
                         ▼
                  Global Middleware
                         │
                         ▼
                  Module Middleware
                         │
                         ▼
                    Global Guards
                         │
                         ▼
                 Controller Guards
                         │
                         ▼
                    Route Guards
                         │
                         ▼
              Global Interceptors (Before)
                         │
                         ▼
           Controller Interceptors (Before)
                         │
                         ▼
              Route Interceptors (Before)
                         │
                         ▼
                   Global Pipes
                         │
                         ▼
                Parameter Pipes
                         │
                         ▼
                    Controller
                         │
                         ▼
                      Service
                         │
                         ▼
                    Repository
                         │
                         ▼
                     Database
                         │
                         ▼
                    Repository
                         │
                         ▼
                      Service
                         │
                         ▼
              Route Interceptor (After)
                         │
                         ▼
          Controller Interceptor (After)
                         │
                         ▼
            Global Interceptor (After)
                         │
                         ▼
               Exception Filter (If Error)
                         │
                         ▼
                    HTTP Response