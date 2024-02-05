FROM node:slim
ENV NODE_ENV development
RUN mkdir -p /app
WORKDIR /app
COPY . /app
COPY package*.json /app
RUN npm install 
EXPOSE 8080
CMD [ "npm", "start" ]
