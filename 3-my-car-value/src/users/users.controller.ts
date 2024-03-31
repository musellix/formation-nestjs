import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user-dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

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

    // GET /auth?email=aaa@aaa.fr
    @Get("")
    findAllUsers(@Query('email') email: string): Promise<User[]> {
        return this.usersService.find( email )
    }

    // GET /auth/:id
    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get("/:id")
    findUser( @Param('id') id:string ): Promise<User> {
        console.log( "handler is running" )
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
