import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
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

    // @Get("/whoami")
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId);
    // }

    @Get("/whoami")
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post("/signout")
    signOut(@Session() session: any) {
        session.userId = null;
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
    async findUser( @Param('id') id:string ): Promise<User> {
        console.log( "handler is running" )
        const user = await this.usersService.findOne( parseInt(id, 10) );
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
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
