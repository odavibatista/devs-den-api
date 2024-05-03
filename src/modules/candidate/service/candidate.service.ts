import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Candidate } from '../entity/candidate.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { Address } from 'src/modules/address/entity/address.entity';
import { CreateCandidateDTO } from '../dto/candidate.dto';
import { RegisterCandidateBodyDTO, RegisterCandidateResponseDTO } from '../domain/requests/RegisterCandidate.request.dto';
import { UnformattedEmailException } from 'src/modules/user/domain/errors/UnformattedEmail.exception';
import { UnformattedPasswordException } from 'src/modules/user/domain/errors/UnformattedPassword.exception';
import { EmailAlreadyRegisteredException } from 'src/modules/user/domain/errors/EmailAlreadyRegistered.exception';
import { Uf } from 'src/modules/uf/entity/uf.entity';
import { UFNotFoundException } from 'src/modules/uf/domain/errors/UfNotFound.exception';
import { JWTProvider } from 'src/modules/user/providers/JWT.provider';

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        @InjectRepository(Uf)
        private readonly ufRepository: Repository<Uf>,
        @InjectDataSource()
        private readonly JwtProvider: JWTProvider
    ) {}

    async create (createCandidateParams: CreateCandidateDTO | RegisterCandidateBodyDTO): Promise<RegisterCandidateResponseDTO | UnformattedEmailException | UnformattedPasswordException | EmailAlreadyRegisteredException> {
        try {
            const user = await this.userRepository.save({
                email: createCandidateParams.credentials.email,
                password: createCandidateParams.credentials.password,
                role: 'candidate'
            })

            if (!user) {
                throw new EmailAlreadyRegisteredException()
                
            } else {


                const uf = await this.ufRepository.findOne({
                    where: { id_uf: createCandidateParams.address.uf }
                })

                if (!uf) {
                    throw new UFNotFoundException()
                }
    
                const address = this.addressRepository.save({
                    uf: uf,
                    cep: createCandidateParams.address.cep,
                    city: createCandidateParams.address.city,
                    street: createCandidateParams.address.street,
                    complement: createCandidateParams.address.complement,
                    number: createCandidateParams.address.number,
                })
    
                const candidate = this.candidateRepository.save({
                    id_profile: user.id_login,
                    name: createCandidateParams.name,
                    gender: createCandidateParams.gender,
                    birth_date: createCandidateParams.birth_date,
                    address_id: (await address).id_address,
                })

                const token = await this.JwtProvider.generate({
                    payload: {
                        id: user.id_login,
                        email: user.email,
                        role: user.role
                    }
                })

                const loginSession = ''
    
                return {
                    user: {
                        id: user.id_login,
                        name: (await candidate).name,
                        role: user.role
                    },
                    
                    token: token,
                }
            }
        } catch (error) {
            if (error instanceof UnformattedEmailException) {
                console.log('UnformattedEmailException')
                throw new UnformattedEmailException()
            } else if (error instanceof UnformattedPasswordException) {
                console.log('UnformattedPasswordException')
                throw new UnformattedPasswordException()
            } else if (error instanceof EmailAlreadyRegisteredException) {
                console.log('EmailAlreadyRegisteredException')
                throw new EmailAlreadyRegisteredException()
            } else {
                console.log(error)
            }
        }
    }
}
