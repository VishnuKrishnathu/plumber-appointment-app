import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import TOKENS from "@constants/token";

@Injectable()
export default class UserAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromRequest(request);
    if (!token) {
      throw new HttpException("Invalid user token", HttpStatus.UNAUTHORIZED);
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: TOKENS.USER_TOKEN(),
      });
      request.user = decoded; // Attach decoded payload to the request object
      return true;
    } catch (error) {
      throw new HttpException("Invalid user token", HttpStatus.UNAUTHORIZED);
    }
  }

  private extractJwtFromRequest(req: any): string | null {
    const { authorization } = req.headers;
    const authToken = req.cookies["auth-token"];
    let token = "";
    if (authorization && authorization.length > 0) token = authorization.split(" ")[1];
    else if (authToken && authToken.length > 0) token = authToken;
    if (token.length === 0) return null;
    return token;
  }
}
