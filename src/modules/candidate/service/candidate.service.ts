import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Candidate } from '../entity/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { Address } from 'src/modules/user/entity/address.entity';
import { CreateCandidateDTO } from '../dto/candidate.dto';
import { RegisterCandidateResponseDTO } from '../domain/requests/RegisterCandidate.request.dto';
import { UnformattedEmailException } from 'src/modules/user/domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from 'src/modules/user/domain/errors/UnformattedPassword.exception';
import { EmailAlreadyRegisteredException } from 'src/modules/user/domain/errors/EmailAlreadyRegistered.exception';

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) {}

    async create (createCandidateDTO: CreateCandidateDTO): Promise<RegisterCandidateResponseDTO | UnformattedEmailException | UnformattedPasswordException | EmailAlreadyRegisteredException> {
        try {
            const userEmail = await this.userRepository.findOne({
                where: { email: createCandidateDTO.credentials.email }
            })

            if (userEmail) {
                throw new EmailAlreadyRegisteredException()
            }  else if (createCandidateDTO.credentials.password.length < 8) {
                throw new UnformattedPasswordException()

            }  else {
                const user = this.userRepository.create({
                    ...createCandidateDTO.credentials,
                    role: 'candidate'
                })
    
                const address = this.addressRepository.create(createCandidateDTO.address)
    
                const candidate = this.candidateRepository.create({
                    id_profile: user.id_login,
                    name: createCandidateDTO.name,
                    address_id: address.id_address,
                    birth_date: createCandidateDTO.birth_date,
                    gender: createCandidateDTO.gender
                })
    
                return {
                    user: {
                        id: user.id_login,
                        name: candidate.name,
                        role: user.role
                    },
                    
                    token: 'token',
                }
            }

        } catch (error) {
            
        }
    }
}
