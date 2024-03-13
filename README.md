 

1 : Get Started Here
discord : https://discord.gg/vvcyvjDkdC


2 : The basics of Nest

2.1 : Project Setup
Prerequis : 
- familiar with Typescript
- NodeJs already installed
- understand the basics of NodeJs


Nest CLI : tool used from our trminal to generate a new project and run it


2.2 : Project from scratch

2.2.1 : Instal dependencies

@nestjs/common : Contains vast majority of functions, classes, etc that we need from Nest

@nestjs/platform-express : Lets Nest use ExpressJs from handling HTTP request
Nest itself does not handle incoming requests
We can either make use of the very popular librairy expressJs or another one called Fastify

reflect-metadata : Helps make decorators work

2.2.2 : Set up Typescript compiler settings

In the tsconfig.json file
"experimentalDecorators": true,
"emitDecoratorMetadata": true
These two features are at the absolute core of what makes Nest really work
So it's super important for us to understand those two settings

Quand on fait une requete, quelquesoit le langage, on traite toujours cette requete de la meme facon : 

1 - validate data contained in the request (Pipe)
2 - Make sure the user is authenticated (Guard)
3 - Route the request to a particular function (Controller)
4 - Run some business logic (Service)
5 - Access to database (Repository)

Nest has tools to help us write these

Controllers : Handles incoming requests
Services : Handles data access and business logic
Modules : Groups together code
Pipes : Validates incoming data
Filters : Handles errors that occu during request handling
Guards : Handles authentification
Interceptors : Adds extra logic to incoming requests or outgoing response
Repositories : Handles data stored in a DB

To make the most simple and basic application possible, we need a Module and a Controller


2.2.3 : Create a Nest module and controller

Main.ts is going to be the first file that gets executed in any project

Main.ts
import { Controller, Module, Get } from "@nestjs/common";

@Controller()
class AppController {

    @Get()
    getRootRoute() {
        return "hi there !";
    }
}

@Controller()
This is refered to as a decorator. In this case, this decorator is telling Nest that we are trying to creaate a class that is going to serve as a controller inside of our application

import { Get } from "@nestjs/common";
This allow us to create route handlers that respond to incoming requests that have an Http method of get

 
@Module({
    controllers: [AppController]
})
class AppModule {}

@Module()
has one propertie controllers, and it's going to list out all the differents controllers that exist inside of our application

Whenever our application starts up, Nest is going to look at the app module, and it's going to find all the controllers that are listed right here, and it's going to automaticaly create an instance of all of our different controller classes


import { NestFactory } from "@nestjs/core";

@Module({
    controllers: [AppController]
})
class AppModule {}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();

Here we add a function that is going to run antime we start up our application. By default, this function is called bootstrap
Inside this function, we create a new Nest application out of our AppModule

Once we've created our app, we're going to tell this app to start to listen for incoming traffic on a particular port on our computer

Finally, we call the boostrap function

Run our application
npx ts-node-dev src/main.ts
we do it like that because we develop our application from scratch
With Nest Api, we'll have a much easier way of starting up our project


2.2.4 : File naming convention

One class per file
Class names should include the kind of thing we are creating
filename template : name.typeOfThing.ts

class AppController --> app.controller.ts
class AppModule --> app.module.ts


2.2.5 : Routing Decorators
We have called the controller decorator nd the get decorator and not passed any arguments
We can also add in some routing rules through the controller decorator and the get decorator

@Controller("/app")
class AppController {

    @Get()
    getRootRoute("/hi") {
        return "hi there !";
    }
}

the function getRootRoute will be cause with the url : /app/hi