import { User } from "@models/user.schema";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { GoogleService } from "@services/google/google.service";
import { Model } from "mongoose";
import TOKENS from "@constants/token";
import UserTokenDto from "./dto/usertoken.dto";
import { FilterQuery, ProjectionType, UpdateQuery } from "mongoose";
import { UserProfile } from "@models/userprofile.schema";

@Injectable()
export class UserService {
  @Inject(GoogleService) private readonly googleService: GoogleService;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfile>,
  ) {}

  async createUser(createUserDto: User) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async updateUserProfile(filter: FilterQuery<UserProfile>, update: UpdateQuery<UserProfile>) {
    return this.userProfileModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
  }

  async findUser(filter: FilterQuery<User>, projection?: ProjectionType<User>) {
    return this.userModel.findOne(filter, projection);
  }

  async generateUserToken(userTokenDto: UserTokenDto) {
    return this.jwtService.signAsync(userTokenDto, {
      secret: TOKENS.USER_TOKEN(),
    });
  }

  async getGoogleTokens(code: string) {
    return this.googleService.getToken(code).then(res => res.tokens);
  }

  async getGoogleUserInfo(access_token: string) {
    return this.googleService.getUserInfo(access_token);
  }
}
