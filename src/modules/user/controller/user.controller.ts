import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { CreateUserDTO, LoginDTO } from '../dto/user.dto';
  import { UserService } from '../service/user.service';
import { JWTProvider } from '../providers/JWT.provider';
import { UserNotFoundException } from '../domain/errors/UserNotFound.exception';
import { User } from '../entity/user.entity';
  
  @Controller('user')
  export class UserController {
    constructor(
      private readonly userService: UserService,
      private JwtProvider: JWTProvider
    ) {}
  
    @Get()
    async findAll(): Promise<any[] | UserNotFoundException> {
      return this.userService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User | UserNotFoundException> {
      return this.userService.findOne(id);
    }
  
    @Post('/register')
    async create(@Body() createUserDto: CreateUserDTO): Promise<any> {
      return this.userService.create(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDTO): Promise<any> {
      return this.userService.login(loginDto);
    }
  }
  
  