
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { CreateUserDTO, UpdatePasswordDTO, UserDTO } from '../dto/user.dto';
  import { UserService } from '../service/user.service';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get(':id')
    async findOne(@Param('email') email: string): Promise<any> {
      return this.userService.findOne(email);
    }
  
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<any> {
      return this.userService.create(createUserDTO);
    }

}