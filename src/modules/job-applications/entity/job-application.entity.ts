import { Candidate } from '../../../modules/candidate/entity/candidate.entity';
import { Job } from '../../../modules/job/entity/job.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
class JobApplications {
  @PrimaryColumn()
  job_id: number;

  @PrimaryColumn()
  candidate_id: number;

  @Column()
  active: boolean;

  @ManyToOne(() => Job, (job) => job.id_job)
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'id_job' }])
  job: Job;

  @ManyToOne(() => Candidate, (candidate) => candidate.id_user)
  @JoinColumn([{ name: 'candidate_id', referencedColumnName: 'id_user' }])
  candidate: Candidate;
}

export { JobApplications as JobApplication };
