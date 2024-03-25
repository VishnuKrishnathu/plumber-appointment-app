import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { RegisterUserDto } from "./dto/registeruser.dto";
import { UserService } from "./user.service";
import { AuthorizedRequest } from "@globalTypes/auth";
import AddAddressDto from "./dto/addaddress.dto";
import UserAuthGuard from "@guards/user-auth.guard";

@Controller("auth/user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("signup")
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    const { code } = registerUserDto;

    const { access_token, refresh_token, expiry_date } = await this.userService.getGoogleTokens(code);

    if (!access_token || !refresh_token || !expiry_date) {
      throw new HttpException("Unexpected error occured", HttpStatus.EXPECTATION_FAILED);
    }

    const { email, picture, name } = await this.userService.getGoogleUserInfo(access_token);

    try {
      const user = await this.userService.createUser({
        expiry_time: new Date(expiry_date),
        access_token,
        refresh_token,
        email: email.toLowerCase(),
        profile_pic: picture,
        name,
      });
      const token = await this.userService.generateUserToken({
        _id: user._id.toString(),
        access_token: user.access_token,
        email: user.email,
        expiry: user.expiry_time.getTime(),
      });

      return {
        token,
      };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Post("signin")
  async signInUser(@Body() loginUserDto: RegisterUserDto) {
    const { code } = loginUserDto;

    const { access_token } = await this.userService.getGoogleTokens(code);

    if (!access_token) {
      throw new HttpException("Unexpected error occured", HttpStatus.EXPECTATION_FAILED);
    }

    const { email } = await this.userService.getGoogleUserInfo(access_token);

    const user = await this.userService.findUser({ email: email.toLowerCase() });

    if (!user) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    const token = await this.userService.generateUserToken({
      _id: user._id.toString(),
      access_token: user.access_token,
      email: user.email,
      expiry: user.expiry_time.getTime(),
    });

    return {
      token,
    };
  }

  @UseGuards(UserAuthGuard)
  @Post("add-address")
  async addAddress(@Body() addAddressDto: AddAddressDto, @Req() request: AuthorizedRequest) {
    const userProfile = await this.userService.updateUserProfile(
      {
        userId: request.user._id,
      },
      {
        $push: {
          address: addAddressDto,
        },
      },
    );

    return userProfile;
  }
}
