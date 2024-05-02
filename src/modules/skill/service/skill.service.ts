import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Skill } from '../entity/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
    constructor(
        @InjectRepository(Skill)
        private ufRepository: Repository<Skill>
    )   {}

    async findAll   (): Promise <Skill[]>  {
        return await this.ufRepository.find()
    }

    async findOne   (id: number): Promise <Skill>    {
        const skill = this.ufRepository.findOne({
            where: { id_skill: id }
        })

        if  (!skill) throw new HttpException(`Empresa não encontrada.`, HttpStatus.NOT_FOUND)

        return skill
    }
}
