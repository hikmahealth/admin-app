#getting base image
FROM node:13.12.0-alpine

MAINTAINER Toby Brotherton <toby@hikmahealth.org>

ENV PATH /app/node_modules/.bin:$PATH

ARG app_env_arg
ENV APP_ENV=$app_env_arg

ARG instance_url_arg
ENV REACT_APP_INSTANCE_URL=$instance_url_arg

# install app dependencies
COPY package.json ./
RUN yarn install
RUN yarn global add react-scripts@3.4.1

# add app
COPY . ./

#start app
CMD ["yarn", "start"]
