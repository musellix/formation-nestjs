import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

@Injectable()
export class AuthService {
    constructor( private usersService:UsersService ) {}

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

    async signin(email: string, password: string) {
        const users = await this.usersService.find( email );
        if ( !users.length) {
            throw new NotFoundException('email not found');
        }
        const user = users[0];

        // Get ther salt
        const salt = user.password.split('.')[0];

        // Hash the salt and the password together
        const hash = (await promisify(scrypt)(password, salt, 32 )) as Buffer;
        
        // Join the hashed result and the salt together
        const result = `${salt}.${hash.toString('hex')}`;

        if( result !== user.password ) {
            throw new BadRequestException('bad password');
        }

        return user;
    }

}
