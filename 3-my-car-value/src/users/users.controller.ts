import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user-dto';

@Controller('auth')
export class UsersController {

    constructor( private usersService: UsersService ) {}

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




}
