import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { CreateUserDTO } from '../dto/user.dto';
  import { UserService } from '../service/user.service';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get()
    async findAll(): Promise<any[]> {
      return this.userService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<any> {
      return this.userService.findOne(id);
    }
  
    @Post()
    async create(@Body() createUserDto: CreateUserDTO): Promise<any> {
      return this.userService.create(createUserDto);
    }
  }
  
  