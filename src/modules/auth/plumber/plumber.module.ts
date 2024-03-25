import { Module } from "@nestjs/common";
import { PlumberController } from "./plumber.controller";
import { PlumberService } from "./plumber.service";
import { JwtModule } from "@nestjs/jwt";
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
  controllers: [PlumberController],
  providers: [PlumberService],
})
export class PlumberModule {}
