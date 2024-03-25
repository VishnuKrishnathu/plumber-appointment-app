import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { PlumberService } from "./plumber.service";
import { RegisterPlumberDto } from "./dto/registerplumber.dto";

@Controller("auth/plumber")
export class PlumberController {
  constructor(private readonly plumberService: PlumberService) {}
  @Post("signup")
  async registerUser(@Body() registerPlumberDto: RegisterPlumberDto) {
    const { code } = registerPlumberDto;

    const { access_token, refresh_token, expiry_date } = await this.plumberService.getGoogleTokens(code);

    if (!access_token || !refresh_token || !expiry_date) {
      throw new HttpException("Unexpected error occured", HttpStatus.EXPECTATION_FAILED);
    }

    const { email, picture, name } = await this.plumberService.getGoogleUserInfo(access_token);

    try {
      const user = await this.plumberService.createUser({
        expiry_time: new Date(expiry_date),
        access_token,
        refresh_token,
        email: email.toLowerCase(),
        profile_pic: picture,
        name,
      });

      const token = await this.plumberService.generateUserToken({
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
  async signInUser(@Body() loginUserDto: RegisterPlumberDto) {
    const { code } = loginUserDto;

    const { access_token } = await this.plumberService.getGoogleTokens(code);

    if (!access_token) {
      throw new HttpException("Unexpected error occured", HttpStatus.EXPECTATION_FAILED);
    }

    const { email } = await this.plumberService.getGoogleUserInfo(access_token);

    const user = await this.plumberService.findUser({ email: email.toLowerCase() });

    if (!user) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    const token = await this.plumberService.generateUserToken({
      _id: user._id.toString(),
      access_token: user.access_token,
      email: user.email,
      expiry: user.expiry_time.getTime(),
    });

    return {
      token,
    };
  }
}
