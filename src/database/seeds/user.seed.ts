import { RoleEnum } from '../../user/role.enum';
import { UserEntity } from '../../user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Clear existing users
    // await dataSource.query('TRUNCATE "users" RESTART IDENTITY;');

    const repository = dataSource.getRepository(UserEntity);

    // Create users using a separate method for better organization
    await this.createUsers(repository);
  }

  private async createUsers(repository: Repository<UserEntity>): Promise<void> {
    // Create a single user
    const buyerUser: UserEntity = repository.create({
      firstName: 'mostafa',
      lastName: 'elsaeed',
      email: 'default@example.com',
      isActive: true,
      role: RoleEnum.BUYER,
      hashPassword: await bcrypt.hash('changeme', 10),
    });
    await repository.insert(buyerUser);
  }
}
