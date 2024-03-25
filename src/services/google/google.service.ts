import { Injectable } from "@nestjs/common";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class GoogleService {
  private readonly oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");

  getToken(code: string) {
    return this.oAuth2Client.getToken(code);
  }

  getUserInfo(access_token: string) {
    return axios
      .get<{
        email: string;
        picture?: string;
        name: string;
      }>("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(res => res.data);
  }
}
