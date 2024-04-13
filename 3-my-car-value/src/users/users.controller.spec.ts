import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: ( id: number) => { 
        return Promise.resolve( { id, email: "aaaa@aaa.com", password: "bbb" } as User )  },
      find: ( email: string) => {
        return Promise.resolve( [ {id: 1, email, password: "bbb" } as User ] )
      },
      // remove: () => {},
      // update: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password} as User)
      }
    }; 

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { 
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users return a list of users with the given email', async () => {
    const users = await controller.findAllUsers( "aaaa@aaa.com" );
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("aaaa@aaa.com");
  });

  it('findUser return a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.email).toEqual("aaaa@aaa.com");
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  });

  it('signin updates session object and return user', async () => {
    const session = {userId: null };
    const user = await controller.signin({ email: 'aaaa@aaa.com', password: 'bbb' }, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
    expect(user.id).toEqual(session.userId);
  })
});
