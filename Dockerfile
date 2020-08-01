# Versão de uma máquina com o básico do node versão 10
FROM node:alpine
# Aonde vai ser descarregada a imagem da nossa app dentro da máquina docker
WORKDIR /usr/app
# Copiar os arquivos
COPY package.json yarn.* ./
# Executa o yarn para instalar as dependências
RUN yarn install

COPY . .
# Vai colocar a porta 3000 exposta
EXPOSE 3333
# Vai rodar o comando yarn buscando o valor do segundo comando configurado no package.json
CMD ["yarn", "dev"]
