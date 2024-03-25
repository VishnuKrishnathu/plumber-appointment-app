import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import dbModels from "@utils/dbModels";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature(dbModels),
    JwtModule.register({
      signOptions: {
        expiresIn: "2 days",
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
