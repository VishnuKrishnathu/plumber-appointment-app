import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { mongooseConfig } from "./utils/dbConfig/mongoose.config";
import { PlumberModule } from "./modules/plumber/plumber.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [MongooseModule.forRootAsync(mongooseConfig), AuthModule, ConfigModule.forRoot(), PlumberModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
