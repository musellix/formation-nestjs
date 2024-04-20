 

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
    new ValidationPipe({
      whitelist: true
    })
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

whitelist: true option in the main js
this option is a security as we don't want to allow users to add in additional properties to incoming request
In out example, the body must only have "content" property

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


7 - Nest architecture : Organizing code with modules

Dependcy Injectoin between modules

Add the service to the module list of exports
@Module({
  providers: [PowerService],
  exports: [PowerService]
})

exports
that mean that this class is available to others modules of our project

Import the module into the other module
@Module({
  imports: [PowerModule],
  providers: [CpuService]
})

imports
we have now connected 2 modules (Power and Cpu modules)

Define the constructor method on CpuService and PowerService to it


8 - Persisting data with TypeORM

Nest work fine with any ORM, but works well out of the box with TypeORM and Mongoose
TypeORM --> SQLite, PostGre, MySql, MongoDB
Mongoose --> MongoDB

For right now, to ease of setup, we'll use SQLite
npm install --save @nestjs/typeorm
npm install --save typeorm
npm install --save sqlite3

When we use TypeORM, we don't have to create repository files manually
We have to create Entity file for each module, and TypeORM will generate automatically Repository files
Entity files list the different properties that an object has (for example, an User or a Report)

Setting up the connexion to SQLite DB

In the app.module.ts file
@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [],
    synchronize: true,
  }),
    UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})

Now, when you launch your application (npm run start:dev), a db.sqlite file will be create at the root of your project

Creating an Entity and Repository

Creating an Entity
- Create an entity file and create a class in it that lists all the properties that your entity will have

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

user.entity.ts
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string
}

- Connect the entity to its parent module. This create a repository
in user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController]
})

- Connect the entity to the root connection (in the app module)
in app.module.ts
@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User],
    synchronize: true,
  }),
    UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})

TypeORM and Nest working together should have created this user repository for us

We want to focus on the "synchronize: true," option
When we want to change the structure of a database in any way (rename a column, add/remove a column, ...), we run something called a Migration. A migration is a little piece of code that somehow change the structure of our database
This synchronize: true feature is only for use in the development environment
This option, when set to true, is going to cause type to take a look at the str7ucture of all your differents entities and then automatically update the structure of your database
Never run that synchronize feture of true in a production. Use Migration


9 - Creating and Saving Data

In the service file
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}
}

Repository<User> : The type of repository is a Repository and we applied a generic type to it of User
@InjectRepository(User) : This is a little bit of an aid to the dependency injection system that we need the user repository. This is because the dependency injection system does not play nicely with generics

In users.service
public create(email:string, password: string ) {
    const user = this.repository.create({ email, password});
    return this.repository.save(user);
}

repository.create -> create an instance of an entity
repository.save -> save is used for actual persistence

Hooks
In our entity class, Hooks allow us to define functions on an entity that will be called automatically at certain points

import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log( `Inserted User with id ${this.id}` )
    }
    
    @AfterUpdate()
    logUpdate() {
        console.log( `Updated User with id ${this.id}` )
    }

    @AfterRemove()
    logRemove() {
        console.log( `Removed User with id ${this.id}` )
    }
}

In the service, you can save an entity without create an instance
For example, you can save an user like that : 
this.repository.save({ email, password});
instead of
this.repository.save(user);

But with the first version, you don't create an entity and the hooks are not executed
Always get an entity instance and thensave or update

Also, use nestJs calls : 
save() vs insert() and update()
If you call save(), the hooks will be executed
Not with insert(), nor update()

remove() vs delete()
If you call remove(), the hooks will be executed
Not with delete()
remove() is designed to work with an entity
delete() is designed to work with just a plain ID or some kind of search criteria as delete({ email: aaa@aaa.fr})

Updating data
public async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne( id );
    if( !user ) {
        throw new NotFoundException( `User ${id} not found` )
    }
    Object.assign( user, attrs );
    return this.repository.save(user)
}

If we want to update some properties of an object (for exemample, only the email), we don't need to create an object and set all properties to null. We can use the utility types Partial

In order to apply an update, we first need a user entity instance (findOne). There is downside of this approach : we first have to fetch out of our database the user that we are trying to update 
If we use the update() method directly, that would require just one single trip to our database. buts the hooks will not be executed
We're kind of paying in performance for having fancy functionality (hooks) that we probably wants (Not required, you can definitely build application without them)


Removing data
public async remove(id: number): Promise<User> {
    const user = await this.findOne( id );
    if( !user ) {
        throw new NotFoundException( `User ${id} not found` )
    }
    return this.repository.remove(user)
}


Routes in the controller
Some examples of routes with differents kinds of parameters
    // POST /auth/signup
    @Post("/signup")
    createUser(@Body() body: CreateUserDto): void {
        this.usersService.create(body.email, body.password);
    }

    // GET /auth?email=aaa@aaa.fr
    @Get("")
    findAllUsers(@Query('email') email: string): Promise<User[]> {
        return this.usersService.find( email )
    }

    // GET /auth/:id
    @Get("/:id")
    findUser( @Param('id') id:string ): Promise<User> {
        return this.usersService.findOne( parseInt(id, 10) );
    }

    // PATCH /auth/:id
    @Patch("/:id")
    updateUser( @Param('id') id:string, @Body() body: UpdateUserDto ): void {
        this.usersService.update( parseInt(id, 10), body )
    }

    // DELETE /auth/:id
    @Delete("/:id")
    removeUser(@Param('id') id:string): void {
        this.usersService.remove( parseInt(id, 10) )
    }


- update
For the update, we need to create a new Dto file to set optionnal the differents properties. We can do it with the decorator @Optional()

import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string
    
    @IsString()
    @IsOptional()
    password: string
}


Exceptions
Our service file could probably throw a NotFoundException
If we throw an exeception like that? it4s going to flow back up right now to our users controller, which communicates over HTTP
But for example, we might eventually have another kind of controller inside of our applcation designed to handle WebSocket traffic or an other designed to handle gRPC request. 
NotFoundException is not compatible with any other kind of communication protocol than HTTP
The others controllers are not going to properly capture that error, extract information from it, and send a response back

If you start to introduce additional communication protocols into your application, just keep this limitation in mind.
A very easy thing to do here would be to implement your own custom exception filter
(but that's not something we are going to see inside this course)


10 - Custom Data Serialization

Excluding response properties

If I fetch a particular user, and the response includes the password of the user
{
  "id": 2,
  "email": "bbb@bbb.com",
  "password": "azerty"
}
We are going to encrypt the password, and decide which properties we want to be returned

in user.entity1
import { Exclude } from "class-transformer";

@Column()
@Exclude()
password: string;

in user.controller
// GET /auth/:id
@UseInterceptors(ClassSerializerInterceptor)
@Get("/:id")
findUser( @Param('id') id:string ): Promise<User> {
    return this.usersService.findOne( parseInt(id, 10) );
}

and that's it. Now if I fetch a particular user, we've got :
{
  "id": 2,
  "email": "bbb@bbb.com"
}


Solution to Serialization
Now imagine we decide to put some admin functionnality inside our app. So there are administraor users, and administrators should be able to look up all the properties, and public users should not see all the properties
We want to send back differents sets of information with the same Entity
And this is really not possible by using the approch recommended by Nest
So we are going to take a look at a slightly different approach that's going to address this wholme issue easily


How to build Interceptors
Interceptors can be used to intercept outgoing responses and incoming requests (very similar to middlewares in many other frameworks)
We can have as many interceptors intyercept incoming requests or outgoing responses as we want
We can apply an interceptor either to individual route handlers, 
or we can apply interceptor to the entire controller, that will make sure that we run the inyerceptor on every handler
or we can apply the interceptor globally, so for every request or response that comes or goes out of our project

create a file /src/interceptors/serialize.interceptor.ts
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        console.log( "I'm running before the handler" )

        return handler.handle().pipe(
            map( (data: any) => {
                // Run something before the response is sent out
                console.log( "i'm running before response is sent out" )
            })
        )
    }
}

and in the controller, definie the interceptor we want to use
// GET /auth/:id
@UseInterceptors(SerializeInterceptor)
@Get("/:id")
findUser( @Param('id') id:string ): Promise<User> {
    console.log( "handler is running" )
    return this.usersService.findOne( parseInt(id, 10) );
}


Serialization in the interceptor

image nestjs-serialization-in-the-interceptor.png

Inside of our interceptor, we're going to take the response that's coming out of our request handler
The response is User Entity instance, we're going to take that User Entity instance, we're going to convert it into a User DTO instance. This User DTO instance is going to have all of our different serialization rules (I want to show the id and the email, not the password)
Then we are going to directly return that instance
Then Nest is going to take that instance, going to turn it into Json automatically and send that back in the response 

serialize.interceptor.ts
export class SerializeInterceptor implements NestInterceptor {

    constructor( private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        console.log( "I'm running before the handler" )

        return handler.handle().pipe(
            map( (data: any) => {
                // Run something before the response is sent out
                console.log( "i'm running before response is sent out" )

                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }
}

user.controller
// GET /auth/:id
@UseInterceptors(new SerializeInterceptor(UserDto))
@Get("/:id")
findUser( @Param('id') id:string ): Promise<User> {
    console.log( "handler is running" )
    return this.usersService.findOne( parseInt(id, 10) );
}

user.dto.ts
import { Expose } from "class-transformer";

export class UserDto {

    @Expose()
    id: number;
    
    @Expose()
    email: string;
}


Wrapping the Interceptor in a Decorator
In the controller, this line is too long : 
@UseInterceptors(new SerializeInterceptor(UserDto))

We will create our own decorator
For this, in the serialize.interceptor.ts class
// own decorator !!
export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

and in the controller
// GET /auth/:id
// @UseInterceptors(new SerializeInterceptor(UserDto))
@Serialize(UserDto)
@Get("/:id")
findUser( @Param('id') id:string ): Promise<User> {
    console.log( "handler is running" )
    return this.usersService.findOne( parseInt(id, 10) );
}


11 - Authentification from scratch

Authentification overview
METTRE IMAGE nestjs-authentification-from-scratch.png


Reminder on Service setup
create auth.service.ts file in users folder

@Injectable()
export class AuthService {
    constructor( private usersService:UsersService ) {}
}

In user.module, add the AuthService in the providers
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService],
  controllers: [UsersController]
})


Implement signup functionnality
in auth.service.ts
async signup(email: string, password: string) {
    // see if email is in use
    const users = await this.usersService.find( email );
    if ( users.length) {
        throw new BadRequestException('email in use');
    }

    // hash the user password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await promisify(scrypt)( password, salt, 32 )) as Buffer;

    // Join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`

    // create a new user and save it
    const user = await this.usersService.create( email, result );

    // return the user
    return user;
}

scrypt is the methode to encrypt the password
scrypt use a callback. has we don't like that, we transform it to a Promise with promisify


Handling User sign in
in auth.service.ts
async signin(email: string, password: string) {
    const users = await this.usersService.find( email );
    if ( !users.length) {
        throw new NotFoundException('email not found');
    }
    const user = users[0];

    // Get ther salt
    const salt = user.email.split('.')[0];

    // Hash the salt and the password together
    const hash = (await promisify(scrypt)(password, salt, 32 )) as Buffer;
    
    // Join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`

    if( result !== user.password ) {
        throw new BadRequestException('bad password');
    }

    return user;
}


Setting up Session
We still don't have the ability to say "Hey this person is signed in and this person is not"
That's what all this cookie stuff is all about

install librairie Cookie- Session
npm install --save cookie-session
npm install --save-dev @types/cookie-session

in main.ts
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['qsdfqsdf']
    }),
  )
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
  await app.listen(3000);
}

The value of the key can be whatever you want, just a series of random numbers and letters
This string is going to be used to encrypt the information that is stored inside the cookie


Changing and fetching Session data
In user.controller.ts
// Session (set)
@Get('/colors/:color')
setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
}

// Session (get)
@Get('/colors')
getColor(@Session() session: any) {
    return session.color;
}


Signing in a User

users.controller.ts
// POST /auth/signup
@Post("/signup")
async createUser(@Body() body: CreateUserDto, @Session() session): Promise<User> {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
}

@Post("/signin")
async signin(@Body() body: CreateUserDto, @Session() session): Promise<User> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
}


Getting the current user
users.controller.ts
@Get("/whoami")
whoAmI(@Session() session: any) {
    return this.usersService.findOne(session.userId);
}

request.http
### Get the currently signed in user
GET http://localhost:3000/auth/whoami


Signing out a user
users.controller.ts
@Post("/signout")
signOut(@Session() session: any) {
    session.userId = null;
}

request.http
### Sign out
POST http://localhost:3000/auth/signout


Interceptor and Decorator
Automatically tell a handler who the currently signed in user is


Decorator
context : Inside the function we write out some aùount of logic to inspect the incoming request
The reason it's referred to as an execution context as opposed to just simply request is that ExecutionCONtext can be used to kind of abstract a websocket incoming message, a gRPC request,  an Http request. A lot of incoming kinds of requests. That allows us to write some code that might work equally well with WebSockets, gRPC, Http, GraphQL, ...


current-user.decorator.ts
export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        console.log( request.session.userId);
        return request.currentUser;
    }
)

A better type annotation for data that any might be never. The type annotation of never means this value is never going to be used accessed in any way


Interceptor
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    constructor( private usersService:UsersService ) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if(userId) {
            const user = await this.usersService.findOne(userId);
            request.currentUser = user;
        }

        return handler.handle();
    }
}

in user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService, 
    AuthService,
    CurrentUserInterceptor
  ],
  controllers: [UsersController]
})

user.controller.ts

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    ...
    @Get("/whoami")
    whoAmI(@CurrentUser() user: string) {
        return user;
    }
}

If we want to use this interceptor to all the controllers of the module, we can definie it in the user.module file
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService, 
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor
    }
  ],
  controllers: [UsersController]
})


Guard
It guard a route and it forbids access to that route if some condition is not met
Our guard is going to check to see if whoever is making request to a particular route is signed

in src/guards/auth.guards.ts
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return request.session.userId;
    }
}

in user.controller.ts
@Get("/whoami")
@UseGuards(AuthGuard)
whoAmI(@CurrentUser() user: User) {
    return user;
}


12 - Getting started with Unit Testing

Testing overwiew
Unit testing : Make sure that individual methods on a class are working correctly
unit testing files are in the src folders (ex : /src/users/users.controller.spec.ts)

If we want to test auth.service.ts, we need to create a copy of the user service in order to create a copy of the authentication service and in turn to make a copy of the user service. That class right there depends upon our users repo and the users repo in turn depends upon SQLite. So to just test our authentication service, we start to get into this kind of dependency nightmare
The trick is we are going to make a fake copy of the user's service.


Integration testing (or e2e) : Test the full flow of a feature
/test/app.e2e-spec.ts --> Integration tests


Testing setup
create a file /src/users/auth.service.spec.ts

npm run test:watch
launch the tests on all the test files

A porposition list is display at eh end of the tests
Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.    
 › Press t to filter by a test name regex pattern.   
 › Press q to quit watch mode.
 › Press i to run failing tests interactively.       
 › Press Enter to trigger a test run.
With "p", we can specify the file we want to test

/src/users/auth.service.spec.ts
describe( 'AuthService', () => {
    let service: AuthService;

    beforeEach(async ()=>{
        // Create a fake copy of the users service
        const fakeUsersService: Partial<UsersService> = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it( 'can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });
});

The providers array is a listing of all the different classes that we might want to inject into our container.
We override the actual depedency of User service with a fake object fakeUsersService


MANAGING APP CONFIGURATION

-- Understanding Dotenv --

setup the config service thing
we are going to install a package that is going to create the config service for us.
npm install --save @nestjs/config

internally that package includes another package called dotenv. The only goal of this library is to put together a list of different environment variables that exist

-- Applying Dotenv for Config --

.env.development file 
DB_NAME='db.sqlite'

.env.test file
DB_NAME='test.sqlite'

dont commit these two files

app.module.ts
@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        }
      }
    }),
    UsersModule, 
    ReportsModule,
  ],
  ...

'isGlobal: true' setting just means that we do not have to re-import the config module.


-- Specifying the Runtime Environment --
npm install --save cross-env

dans package.json
"start": "cross-env NODE_ENV=development nest start",
"start:dev": "cross-env NODE_ENV=development nest start --watch",
"start:debug": "cross-env NODE_ENV=development  nest start --debug --watch",
"start:prod": "node dist/main",
"lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
"test": "cross-env NODE_ENV=test jest",
"test:watch": "cross-env NODE_ENV=test jest --watch --maxWorkers=1",
"test:cov": "cross-env NODE_ENV=test jest --coverage",
"test:debug": "cross-env NODE_ENV=test node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
"test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json"


-  Solving a SQLite Error --
SQLITE_BUSY: database is locked

Our test runner is jest.
Jest is going to read our two different spec files because we have app.spec file and auth.spec file. jest tries to run all of your different tests at the exact same time.
So that means that we have one test running that's going to create an instance of our application and try to access the Test SQLite database. At the same time, we are also going to be running the app spec file and that is also going to be creating an instance of our application and try to connect to that exact same database.

in package.json file
"test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json --maxWorkers=1"


The last thing we have to take care of is to make sure that we delete all the data inside of our test database right before every single test runs.

In jest-e2e.json file
  },
  "setupFilesAfterEnv": ["<rootDir>/setup.ts"]
}

This defines a file that's going to be executed after all of our tests, or I should say, right before
rootDir is a reference to out test directory

create a setup.ts file in test folder
import { rm } from "fs/promises";
import { join } from "path";

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch( error ) {}
});


-- A Followup Test --















