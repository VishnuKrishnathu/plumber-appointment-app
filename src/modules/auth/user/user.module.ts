import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import dbModels from "@utils/dbModels";
import { GoogleModule } from "@services/google/google.module";

@Module({
  imports: [
    MongooseModule.forFeature(dbModels),
    JwtModule.register({
      signOptions: {
        expiresIn: "2 days",
      },
    }),
    GoogleModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
