import TOKENS from "@constants/token";
import { Plumber, PlumberDocument } from "@models/plumber.schema";
import { Service } from "@models/service.schema";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { GoogleService } from "@services/google/google.service";
import { FilterQuery, ProjectionType, Model } from "mongoose";

@Injectable()
export class PlumberService {
  @Inject(GoogleService) private readonly googleService: GoogleService;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Plumber.name) private readonly plumberModel: Model<Plumber>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
  ) {}

  async createUser(createUserDto: Plumber) {
    const user = new this.plumberModel(createUserDto);
    return user.save();
  }

  async findUser(filter: FilterQuery<PlumberDocument>, projection?: ProjectionType<PlumberDocument>) {
    return this.plumberModel.findOne(filter, projection);
  }

  async getGoogleTokens(code: string) {
    return this.googleService.getToken(code).then(res => res.tokens);
  }

  async getGoogleUserInfo(access_token: string) {
    return this.googleService.getUserInfo(access_token);
  }

  async generateUserToken(userTokenDto: any) {
    return this.jwtService.signAsync(userTokenDto, {
      secret: TOKENS.PLUMBER_TOKEN(),
    });
  }
}
