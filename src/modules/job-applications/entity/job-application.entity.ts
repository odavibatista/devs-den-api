import { Candidate } from "../../../modules/candidate/entity/candidate.entity";
import { Job } from "../../../modules/job/entity/job.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
class JobApplications {
    @PrimaryColumn({ name: 'job_id' })
    job_id: number

    @PrimaryColumn({ name: 'candidate_id' })
    candidate_id: number

    @Column({
      default: true
    })
    active: boolean

    @ManyToOne(
        () => Job,
        job => job.id_job
      )
      @JoinColumn([{ name: 'job_id', referencedColumnName: 'id_job' }])
      jobs: Job[];
    
      @ManyToOne(
        () => Candidate,
        candidate => candidate.id_user
      )
      @JoinColumn([{ name: 'candidate_id', referencedColumnName: 'id_user' }])
      courses: Candidate[];
}

export { JobApplications as JobApplication }