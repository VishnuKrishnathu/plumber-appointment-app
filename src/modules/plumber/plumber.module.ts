import { Module } from "@nestjs/common";
import { PlumberController } from "./plumber.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import dbModels from "@utils/dbModels";
import { PlumberService } from "./plumber.service";

@Module({
  imports: [
    MongooseModule.forFeature(dbModels),
    JwtModule.register({
      signOptions: {
        expiresIn: "2 days",
      },
    }),
  ],
  controllers: [PlumberController],
  providers: [PlumberService],
})
export class PlumberModule {}
