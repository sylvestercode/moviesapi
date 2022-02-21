# Node.js recruitment task

Movie api that fetches movie from external api base on title supplied:

1. `POST /movies`
   1. Authenticated users can add movies based on title provided and additional movies is fetched from    https://omdbapi.com/ 
   2. Basic users can add only five movies in a month
   3. Authenticated users can add movies using the below curl request


2. `GET /movies`
  
   ```
 curl -X POST http:localhost:3000/movies
   -H 'Content-Type: application/json'
   -H "Authorization: Bearer {token}"
   -d '{"title":"batman"}'
   
   ```

2. `GET /movies`
   1. Get movies posted by a particular user by ID
   
    ```
 curl -X POST http:localhost:3000/movies/123

   ```


To Authorize user kindly use the curl request below

    ```
curl -X POST http:localhost:3000/auth
   -H 'Content-Type: application/json'
   -d '{"username": "basic-thomas","password": "sR-_pcoow-27-6PAwCD8"}'

   ```



## Prerequisites to run locally

You need to have `docker` and `docker-compose` installed on your computer to run the service

## To Run locally

1. Clone this repository
1. Run from root dir

```
docker-compose up -d
```

By default the application starts on port: 3000

## Database 


Mongodb Atlas was used so you will have to be connected to the internet in other to test successfully.
