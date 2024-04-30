import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Skills } from '../entity/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
    constructor(
        @InjectRepository(Skills)
        private skillRepository: Repository<Skills>
    )   {}

    async findAll   (): Promise <Skills[]>  {
        return await this.skillRepository.find()
    }

    async findOne   (id: number): Promise <Skills>    {
        const skill = this.skillRepository.findOne({
            where: { id_skill: id }
        })

        if  (!skill) throw new HttpException(`Empresa não encontrada.`, HttpStatus.NOT_FOUND)

        return skill
    }
}
