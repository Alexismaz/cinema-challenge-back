import { Injectable, Logger } from '@nestjs/common';
import { BookerService } from '../modules/booker/booker.service';
import { UserRoleType } from '@models/Booker.entity';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);
  constructor(private readonly bookerService: BookerService) {}

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
      const userExists = await this.bookerService.bookerExistByEmail(user.email);

      if (!userExists) {
        await this.bookerService.createBooker(user);
      }
    }
  }
}
