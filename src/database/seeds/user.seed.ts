import { RoleEnum } from '../../user/role.enum';
import { UserEntity } from '../../user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const sellerEmail = 'default@seller.com';
    const userExists = await this.checkUserExists(repository, sellerEmail);
    if (userExists) {
      const sellerUser: UserEntity = repository.create({
        firstName: 'mostafa',
        lastName: 'elsaeed',
        email: sellerEmail,
        isActive: true,
        role: RoleEnum.BUYER,
        hashPassword: await bcrypt.hash('changeme', 10),
      });
      await repository.insert(sellerUser);
      console.log(`User with email ${sellerEmail} created successfully.`);
    } else {
      console.log(`User with email ${sellerEmail} already exists.`);
    }
  }
  private async checkUserExists(
    repository: Repository<UserEntity>,
    email: string,
  ): Promise<boolean> {
    const user = await repository.findOne({ where: { email } });
    return !!user;
  }
}
