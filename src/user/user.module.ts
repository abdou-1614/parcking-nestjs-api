import { UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from 'src/utils/multer.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MulterModule.register(MulterConfig)
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
