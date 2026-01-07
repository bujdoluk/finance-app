# PERSONAL FINANCE APP

This is a personal finance tracking app. Users can create budgets, pots to better track their expenditure. 
They can see overview of their transactions and recurring bills.
This project is based on coding challenge from website https://www.frontendmentor.io/home that provides designs in figma to practice programming skills.
It is a fullstack app created with tech stack:
   
   - BE: NodeJs, Typescript, Postgres, Docker, Nginx
   - FE: Nuxt, Vue 3, TailwindCSS
        
![Challenge screenshot](./frontend/public/challenge-screenshot.png)

### Prerequisites
Before you begin, make sure you have met the following requirements:

- installed **code editor** -> [Download VSCode]https://code.visualstudio.com/
- installed **git** (for cloning the repository) -> [Download Git]https://git-scm.com/
- installed **node** (v22 or higher) -> [Download Node]https://nodejs.org/en
- installed **npm or nvm** (v9 or higher) -> [Download NPM or NVM]https://www.npmjs.com/ https://github.com/nvm-sh/nvm
- installed **docker** -> [Download Docker]https://www.docker.com/

- `git clone git@github.com:bujdoluk/finance-app.git`

DISCLAIMER 
- Following commands may vary based on your OS. You may have to change them to make them work on your OS. This app is being developed on Windows.

### Environment variables

- Create .env file in ./backend path and add your configuration
- DONT FORGET TO ADD YOUR .env FILE INTO .gitignore !!!

### Install dependencies

- `cd backend`
- `npm i`
- `cd ..`
- `cd frontend`
- `npm i`

### RUN FE app via npm script

- `npm run dev`

### RUN FE app via Docker

- Available soon

### RUN BE app via docker

- `docker-compose up --build -d`

### STOP BE app via docker

- `docker-compose stop`

### CREATE migrations and seeds

- `npm run migrate:create create_users_table`
- `npm run migrate:create seeds_users_table`

### RUN migrations
All docker containers must be up and running before running migrations

- `docker exec -it api npm run migrate:up`
- `docker exec -it api npm run migrate:down`
- `docker exec -it api npm run migrate:redo`

### GENERATE typescript types from database schema
All docker containers must be up and running before running migrations

Open container bash
- `docker exec -it api sh`

Execute those commands inside api container bash
- `docker compose exec -it api npx pg-to-ts generate -c postgres://<db_user>:<db_password>@<db_host>:<db_port>/<db_name> -o ./database/dbSchema.ts`
- `exit`

Copy dbSchema.ts from container to your local machine
- `docker cp api:/usr/src/app/database/dbSchema.ts  ./database/dbSchema.ts`

### RUN tests

- Available soon

### How to update FE and BE apps using nvm
Open bash as an administrator

To upgrade Node you may first want to see which version of Node.js you are currently using:

- `node --version`

Find out which versions of Node.js you may have installed and which one of those you're currently using:

- `nvm ls`

List all versions of Node.js available for installation:

- `nvm ls available`

Assuming you would pick Node.js v22.0.0 for installation you'd type the following to install that version:

- `nvm install v22.0.0`

Use installed version

- `nvm use v22.0.0`