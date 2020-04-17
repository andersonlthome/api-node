# Engajei Api Node

## Tecnologias

 - NodeJS
 - Express
 - Express-async-errors
 - Express-handlebars
 - Nodemon
 - Sucrase
 - MongoDB
 - Redis
 - ESlint + Prettier
 - @sentry/node
 - bcryptjs
 - bee-queue
 - cors
 - date-fns
 - JWT
 - Multer
 - nodemailer
 - Youch
 - Yup
 - Consumo da API do Asaas (plataforma de pagamentos)

## Run
 - git clone https://github.com/andersonlthome/api-node-gobarber-rocketseat
 - docker build -t app-engajei .  //CRIAR CONTAINER NODE
 - docker run -p 3333:3333 -d app-engajei //SOMENTE A PRIMEIRA VEZ
 - docker stop <id container> //pegar com "docker ps"
 - docker-compose up //INICIAR A APLICAÇÃO
 - yarn sequelize db:migrate //CRIAR MIGRATION
