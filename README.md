This is a demo project that fronts an origin api with another middleware api, or reverse proxy. 

The breakdown is as follows:
- Golang origin API
- TypeScript middleware API
- Locust load generator
- Docker compose to orchestrate the services

```console
user@~: $ docker compose up --force-recreate --remove-orphans --build --watch

user@window2: $ curl -v -XGET http://localhost:3000/400

load-1        | [2024-11-11 16:41:38,177] 747aefea5a96/INFO/locust.main: Starting Locust 2.32.2
load-1        | [2024-11-11 16:41:38,177] 747aefea5a96/INFO/locust.main: Starting web interface at http://0.0.0.0:8089
typescript-1  | 8fa66a viewer Request <-- GET /400
typescript-1  | 8fa66a origin Request <-- GET /400
go-1          | [172.20.0.4]:49284 400 - GET /400
typescript-1  | 8fa66a origin Response --> 400
typescript-1  | 8fa66a viewer Response --> 400
```