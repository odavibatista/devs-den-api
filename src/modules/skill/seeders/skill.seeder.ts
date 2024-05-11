import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Skill } from '../entity/skill.entity';

export default class SkillSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Skill);
    const skills = [
      {
        name: 'Java',
      },
      {
        name: 'HTML',
      },
      {
        name: 'CSS',
      },
      {
        name: 'Javascript',
      },
      {
        name: 'Typescript',
      },
      {
        name: 'React',
      },
      {
        name: 'Angular',
      },
      {
        name: 'Vue',
      },
      {
        name: 'Node',
      },
      {
        name: 'Python',
      },
      {
        name: 'Django',
      },
      {
        name: 'C#',
      },
      {
        name: 'C++',
      },
      {
        name: '.NET',
      },
      {
        name: 'Ruby',
      },
      {
        name: 'Ruby on Rails',
      },
      {
        name: 'PHP',
      },
      {
        name: 'COBOL',
      },
      {
        name: 'Swift',
      },
      {
        name: 'Kotlin',
      },
      {
        name: 'Laravel',
      },
      {
        name: 'Git',
      },
      {
        name: 'Docker',
      },
      {
        name: 'Kubernetes',
      },
      {
        name: 'GCP',
      },
      {
        name: 'AWS',
      },
      {
        name: 'Microsoft Azure',
      },
      {
        name: 'SQL',
      },
      {
        name: 'NoSQL',
      },
      {
        name: 'MongoDB',
      },
      {
        name: 'PostgreSQL',
      },
      {
        name: 'MySQL',
      },
      {
        name: 'Oracle',
      },
      {
        name: 'Firebase',
      },
      {
        name: 'SQLite',
      },
      {
        name: 'Redis',
      },
      {
        name: 'Elasticsearch',
      },
      {
        name: 'Kibana',
      },
      {
        name: 'Logstash',
      },
      {
        name: 'Nginx',
      },
      {
        name: 'Apache',
      },
      {
        name: 'IIS',
      },
      {
        name: 'Jenkins',
      },
      {
        name: 'RabbitMQ',
      },
    ];
    // ---------------------------------------------------

    const newSkill = await repository.create(skills);
    await repository.save(newSkill);
  }
}
