import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Skill } from '../entity/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindSkillsResponseDTO } from '../domain/requests/FindSkills.request.dto';
import { SkillNotFoundException } from '../domain/errors/SkillNotFound.exception';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private ufRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<FindSkillsResponseDTO | SkillNotFoundException> {
    const skills = await this.ufRepository.find();

    const mappedSkills = skills.map((skill) => {
      return {
        id_skill: skill.id_skill,
        name: skill.name,
        // Other implementation, if possible
        // image_url: skill.image_url,
      };
    });

    return mappedSkills;
  }

  async findOne(id: number): Promise<Skill> {
    const skill = this.ufRepository.findOne({
      where: { id_skill: id },
    });

    if (!skill)
      throw new HttpException(`Empresa não encontrada.`, HttpStatus.NOT_FOUND);

    return skill;
  }
}
