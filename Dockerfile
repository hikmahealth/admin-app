#getting base image
FROM node:13.12.0-alpine

MAINTAINER Toby Brotherton <toby@hikmahealth.org>

ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN yarn install
RUN yarn install react-scripts@3.4.1 -g

# add app
COPY . ./

#start app
CMD ["yarn", "start"]