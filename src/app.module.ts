import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ParckingPlaceModule } from './parcking-place/parcking-place.module';
import { ParckingCategoryModule } from './parcking-category/parcking-category.module';
import { FloorModule } from './floor/floor.module';
import { TariffModule } from './tariff/tariff.module';
import { ReportsModule } from './reports/reports.module';
import { SettingModule } from './setting/setting.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SlotModule } from './slot/slot.module';
import { ParckingModule } from './parcking/parcking.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessJwtGuard } from './auth/access-jwt-auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoleGuard } from './common/guards/role.guard';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'tmp'),
      serveRoot: '/tmp',
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule, 
    ParckingPlaceModule, 
    ParckingCategoryModule, 
    ParckingModule,
    FloorModule, 
    TariffModule,
    ReportsModule, 
    SettingModule,
    SlotModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessJwtGuard
    }
  ]
})
export class AppModule {}
