FROM node:6
RUN mkdir -p /app
#WORKDIR /main             # Sets the working directory in the container
#COPY package.json /main   # copy the dependencies file to the working directory
#RUN npm install          # Install dependencies
#COPY . /main       # Copy the content of the local src directory to the working directory
#EXPOSE 4200
#CMD ["npm", "run", "start"]
# Create app directory

WORKDIR /app
# COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD [ "node", "app.js" ]