import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    public create(email:string, password: string ) {
        const user = this.repository.create( { email, password});
        return this.repository.save(user);
    }

    public findOne( id: number ):Promise<User> {
        return this.repository.findOneBy({ id });
    }

    public find(email: string): Promise<User[]> {
        return this.repository.find({where: { email } });
    }

    public async update(id: number, attrs: Partial<User>): Promise<User> {
        const user = await this.findOne( id );
        if( !user ) {
            throw new Error( `User ${id} not found` )
        }
        Object.assign( user, attrs );
        return this.repository.save(user)
    }

    public remove(): void {

    }

}
