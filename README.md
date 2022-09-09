# Angular 13, .NET Core Web API with EF core, MSSQL server and Docker

This is a sample personal finance project showing the steps taken to run a simple 3 tier application using Angular, .NET Core Web API with EF core and MSSQL server using open Open Source development tools (VsCode) using a Windows 10 Professional laptop. 

## Step 1: Install Docker for Windows
1. Make sure you have Windows 10 Pro or Enterprise (Docker for Windows require Hyper-V)
2. Install Docker for Windows at [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)
3. Make sure Docker is running in Linux mode

## Step 2: Run the whole app using Docker-compose file
1. go to the root level (`Docker` folder) and create new file called `docker-compose.yml`. This file describe how containers are started and stopped
2. run `docker-compose up` to run the app
3. run `docker-compose down` to shut down the app

## Step 3: Enjoy project with details over
- ClientWeb -> localhost:80 or myhost:80
- MSSQlServer -> localhost:443 (user and pass on Finansys.Api/environments)
- WebApi w/ Swagger -> localhost:8000

