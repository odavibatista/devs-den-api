import { Candidate } from "src/modules/candidate/entity/candidate.entity";
import { Job } from "src/modules/job/entity/job.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class JobApplications {
    @PrimaryColumn({ name: 'job_id' })
    job_id: number

    @PrimaryColumn({ name: 'candidate_id' })
    candidate_id: number

    @ManyToOne(
        () => Job,
        job => job.id_job,
         { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
      )
      @JoinColumn([{ name: 'job_id', referencedColumnName: 'id_job' }])
      jobs: Job[];
    
      @ManyToOne(
        () => Candidate,
        candidate => candidate.id_user,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
      )
      @JoinColumn([{ name: 'candidate_id', referencedColumnName: 'id_user' }])
      courses: Candidate[];
}
