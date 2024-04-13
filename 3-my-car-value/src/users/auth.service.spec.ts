import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe( 'AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        const users: User[] = [];

        // Create a fake copy of the users service
        // fakeUsersService = {
        //     find: () => Promise.resolve([]),
        //     create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
        // };

        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter( user => user.email === email);
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const createdUser = { id: Math.floor(Math.random()*1000), email, password } as User;
                users.push(createdUser);
                return Promise.resolve(createdUser);
            }
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

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('aaa@aaa.com', 'bbbb');
        expect(user.password).not.toEqual('bbbb');

        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        // fakeUsersService.find = () => {
        //     return Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        // };
        // await expect(service.signup('aaaa@aaa.com', 'bbbb')).rejects.toThrow(BadRequestException)

        // -------------------
        
        await service.signup("aaaa@aaa.com", "bbbb");
        await expect(service.signup("aaaa@aaa.com", "bbbb")).rejects.toThrow(BadRequestException)
    });
    
    it('throws if signin is called with an unused email', async () => {
        await expect( service.signin('zzz@aazzza.com', 'bbbb')).rejects.toThrow(NotFoundException);
    });
    
    it('throws if an invalid password is provided', async () => {
        // fakeUsersService.find = () => {
        //     return cc[{ id: 1, email: "aaaa@aaaa.com", password: "zzz"} as User])
        // };
        // await expect(service.signin('aaaa@aaaa.com', 'bbbb')).rejects.toThrow(BadRequestException)
        
        // -------------------

        await service.signup('aaaa@aaa.com', 'password');
        await expect(service.signin('aaaa@aaa.com', 'bbbb')).rejects.toThrow(BadRequestException);
    });


    it('returns a user if correct password is provided', async () => {
        // "mypassword" --> 08ad462d2a7fbe65.817159d37687983531051e096d2a5d61597a988fc160aa46154903d108f7077b
        
        // fakeUsersService.find = () => {
        //     return Promise.resolve([{ id: 1, email: "aaaa@aaaa.com", password: "08ad462d2a7fbe65.817159d37687983531051e096d2a5d61597a988fc160aa46154903d108f7077b"} as User])
        // };

        // -------------------

        await service.signup( 'bbbb@bbbb.com', 'mypassword' );
        
        const user = await service.signin('bbbb@bbbb.com', 'mypassword')
        await expect(user).toBeDefined()
    })

});