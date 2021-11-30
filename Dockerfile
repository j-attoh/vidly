FROM node 

WORKDIR /usr/src/app  

COPY package*.json ./

RUN npm install 
#RUN npm install --production

# production 
#RUN npm ci --only=production

COPY . . 

EXPOSE 5000 

CMD ["node", "index.js"]



