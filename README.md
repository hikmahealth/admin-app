## Hikma Health Admin Application

The Hikma Health platform is a mobile electronic health record system designed for organizations working in low-resource settings to collect and access patient health information. The platform is a lightweight android application that supports offline functionality and multiple languages including Arabic, Spanish, and English. The medical workflows are designed to be intuitive and allow for efficient patient registration and data entry in low-resource, dynamic, and mobile settings.

This repository contains the client-side code for the administration app designed for user management of the Hikma mobile app. This app is built using React, Typescript and Google Material Design. The corresponding server-side code is located at https://github.com/hikmahealth/hikma-health-backend. Please feel free 
to file feature requests and bugs at either location.

Local Setup
-----------

First, run your backend repository locally. Refer to the [backend repo](https://github.com/hikmahealth/hikma-health-backend) for setup documentation.
Fork the admin app to your organization on github.
**Replace urls in all api calls with your ip address:**
Change all instances of `${process.env.REACT_APP_INSTANCE_URL}` to `http://[your_ip]:8080`

Open a terminal in the frontend project, and
`npm install`
`npm start`
The app will run in development mode. Open http://localhost:3000 to view it in the browser.

Login with the local user that you created during the backend repository setup

Deployment on GCP
-----------------
In cloudbuild.yaml:
Remove the following lines:

``` 
name: 'gcr.io/cloud-builders/kubectl'
env: ['CLOUDSDK_COMPUTE_ZONE=us-east1-b', 'CLOUDSDK_CONTAINER_CLUSTER=demo-cluster]
args: ['set', 'image', 'deployment/demo-admin-app',
       'admin-app=gcr.io/$PROJECT_ID/admin-app:$COMMIT_SHA']
```


This deployment does not exist yet, and we can’t make deployment until we create the image, so we must add in the automatic deployment step after the initial deployment.

You can delete the unused cloudbuild[...].yaml files

**Create build trigger**
Create a “Push to a branch” build trigger, using the master branch of your admin-app as a source, and your cloudbuild.yaml file as a Configuration.
Be sure to add the following substitution variable:
Variable= _INSTANCE_URL
Value= https://[backend_api_hostname].[domain]

Commit your changes to master to kick off the build trigger.

**Kubernetes**
Use the example .yaml files found in the ./k8s directory to create the certificate, service, and ingress, like you did for the backend repository. Of course, change all names. Create the deployment using the initial image from the build trigger. There is no template deployment.yaml file in the admin-app repository, but you can use the deployment.yaml file from the backend repository as a template for the deployment, or just create it through the GCP console.

**DNS**
Go to domains.google.com and add a new DNS Resource Record, like you did for the backend ingress. Use the same host name as the domain that you specified in the certificate.yaml. Add the IP address of the Ingress for the record

Lastly, using the correct compute zone, cluster name, deployment name, container name, and image, add the following lines back into the cloudbuild file:

``` 
name: 'gcr.io/cloud-builders/kubectl'
env: ['CLOUDSDK_COMPUTE_ZONE=us-east1-b', 'CLOUDSDK_CONTAINER_CLUSTER=demo-cluster]
args: ['set', 'image', 'deployment/demo-admin-app',
       'admin-app=gcr.io/$PROJECT_ID/admin-app:$COMMIT_SHA']
```

Commit and push to master for build trigger and deployment to execute

