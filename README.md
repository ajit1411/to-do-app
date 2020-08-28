# NodeJs based RESTful APIs for ToDo application
Basic to-do application with bucketing feature built with Express. Task can be created and maintained using OAuth tokens that are JWT Tokens. Task can have a parent called as Bucket. Task can be part of multiple buckets.

## Express
This project is completely based on NodeJs and ExpressJs framework. It uses various packages like ***jsonwebtoken***, ***bcrypt***, ***mongodb***, etc. to support the application on varios horizons.

## MongoDB
This project uses ***MongoDB Database*** as its backend storage for storing the users, tasks, buckets.

## Bcrypt
Bcrypt used for encrypting the user password before storing it to the database

## jsonwebtoken
It is used for verifying and decoding the user authorization token passed in request headers

## Nodemon
It is a development dependency

## API Endpoints
  ### Tasks
    - /task/my-tasks (GET)
      - Fetches all the tasks of the user
    - /task/new (POST)
      - Creates new task for the user
      - A task can have mutliple parents or no parents at all.
    - /task/:taskId (POST)
      - To update the task

  ### Bucket
    - /bucket/my-buckets (GET)
      - Fetches all the task buckets user has created
    - /bucket/new (POST)
      - Creates new bucket for the user
  
  ### User
    - /user/login (POST)
      - It takes user creadentials as the input
      - It returns the response with JWT token for further communication
      - This JWT token has 1 hr of lifespan
