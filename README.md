 

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

the function getRootRoute will be called with the url : /app/hi



3 : Generating project with Nest CLI

install nest cli
npm install -g @nestjs/cli

create a new project
nest new my-project

start your project in a development mode
npm run start:dev

generate a module
nest generate module my-module

generate a controller
nest generate controller messages/messages --flat
nest generate
controller -> type of class to generate
messages/ -> place the file in the messages folder
messages -> class name
-- flat -> don't create an extra folder called 'controller'



4 : Accessing request data with decorators

A request is a just a couple of different lines of text
METTRE IMAGE nesjs-http-request.png


ET nesjs-http-request-2.png

@Post()
createMessage(@Body() body: any) {
    console.log(body)
}
Nest is going to automatically extract the body of the incoming request and provide it as an argument

@Get('/:id')
getMessage(@Param('id') id:string) {
    console.log( id )
}


5 : Using Pipes for validation
install the class-validator library to take advantage of ValidationPipe
npm install --save class-validator

install the class-transformer library to take advantage of ValidationPipe
npm install --save class-transformer

in main.js
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);
  app.useGlobalPipes(
    new ValidationPipe()
  );
  await app.listen(3000);
}

DTO : Data transfer object

In the folder messages, create a folder 'dto'
In that dto folder, create a create-message.dto.ts file

import { IsString } from "class-validator";

export class CreateMessageDto {
    @IsString()
    content: string
}

in the message controller, update the create message method

import { CreateMessageDto } from './dtos/create-message.dto';

@Post()
createMessage(@Body() body: CreateMessageDto) {
    console.log(body)
}

And that's it ! We have now set up validation

The validation pipe use clas-tranformer to turn the body into an instance of the DTO class
For more informations on class-transformer
See readme on https://github.com/typestack/class-transformer

Then the validation pipe use class-validator to validate the instance
For more informations on class-validator like IsString()
See readme on https://github.com/typestack/class-validator


6 - Nest architeture : Services and repositories

We are going to have a message service and a message repository
Frequently end up having very similar methode names

Service : place to put any business logic
Use one or more repository to find or store data

import { Injectable } from "@nestjs/common";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService {

    constructor( public messagesRepository: MessagesRepository ) {}

    findOne( id:string ) {
        return this.messagesRepository.findOne( id )
    }

    findAll() {
        return this.messagesRepository.findAll();
    }

    create(content:string) {
        return this.messagesRepository.create( content )
    }
}

Repositories : place to put storage-related logic
Usually ends up being a TyperORM entity, a Mongoose schema or similar

import { readFile, writeFile } from "fs/promises";

@Injectable()
export class MessagesRepository {

    async findOne( id:string ) {
        const contents = await readFile( 'messages.json', 'utf8' );
        const messages = JSON.parse(contents)
        return messages[id];
    }

    async findAll() {
        const contents = await readFile( 'messages.json', 'utf8' );
        const messages = JSON.parse(contents)
        return messages;
    }

    async create(content:string) {
        const contents = await readFile( 'messages.json', 'utf8');
        const messages = JSON.parse(contents)
        const id = Math.floor(Math.random() * 1000);
        messages[id] = {id, content};

        await writeFile('messages.json', JSON.stringify(messages))
    }
}


Dependance Injection Flow
1 - At startup, register all classes with the container
2 - Container will figure out what each dependency each class has
-- For this, use the 'Injectable' decorator on each class and them to the modules list of providers

3 - We then ask the container to create an instance of a class for us
4 - Container creates all required dependencies and gives us the instance
5 - Container will hold onto the created dependency instances and reuse them if needed
-- Happens automaticall. Nest will try to create controller instance for us

We add @Injectable() decorator in the service class and in the repository class to inject them 


In Messages.module, add the service and the repository in the providers
Providers means "things that can be used as dependecies for other classes"

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository]
})


Reporting Errors with Exceptions
In the controller, we can add a NotFoundException

    @Get('/:id')
    getMessage(@Param('id') id:string) {
        const message = this.messagesService.findOne(id);
        if( !message) {
            throw new NotFoundException( `no message for id : ${id}` )
        }
        return message;
    }

There are different kind of execeptions that Nest defines for us
You can throw any of4 these excepetions and Nest will automataically convert them into an appropriate status code, and an appropriate error message to send back to the user
404 not found
400 bad request
500 internal error
503 timeout











