import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import { PlumberModule } from './plumber/plumber.module';
import { AdminModule } from './admin/admin.module';
import dbModels from "@utils/dbModels";

@Module({
  imports: [MongooseModule.forFeature(dbModels), UserModule, PlumberModule, AdminModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
