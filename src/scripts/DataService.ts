import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { UserRoleType } from '@models/User.entity';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);
  constructor(private readonly userService: UserService) {}

  async loadDataByDefault(): Promise<void> {
    const defaultUsers = [
      {
        email: 'alexisfajian@gmail.com',
        password: '123456',
        role: UserRoleType.ADMIN,
      },
    ];
    for (const user of defaultUsers) {
      this.logger.debug(`creating default user ${user.email} if it does not exist`);
      const userExists = await this.userService.userExistByEmail(user.email);

      if (!userExists) {
        await this.userService.createUser(user);
      }
    }
  }
}
