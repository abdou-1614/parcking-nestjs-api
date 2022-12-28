import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ParckingPlaceModule } from './parcking-place/parcking-place.module';
import { ParckingCategoryModule } from './parcking-category/parcking-category.module';
import { FloorModule } from './floor/floor.module';
import { TariffModule } from './tariff/tariff.module';
import { ParckingSetupModule } from './parcking-setup/parcking-setup.module';
import { ParckingManagementModule } from './parcking-management/parcking-management.module';
import { ReportsModule } from './reports/reports.module';
import { SettingModule } from './setting/setting.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule, 
    ParckingPlaceModule, 
    ParckingCategoryModule, 
    FloorModule, 
    TariffModule, 
    ParckingSetupModule, 
    ParckingManagementModule, 
    ReportsModule, 
    SettingModule

  ],
})
export class AppModule {}
