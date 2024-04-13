import { Injectable } from "@nestjs/common";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

type Event = {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
};

@Injectable()
export class GoogleService {
  private readonly oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");

  getToken(code: string) {
    return this.oAuth2Client.getToken(code);
  }

  async createEvent(event: Event, access_token: string, refresh_token: string) {
    const calendar = google.calendar({ version: "v3", auth: this.oAuth2Client });

    this.oAuth2Client.setCredentials({
      access_token,
      refresh_token,
      token_type: "Bearer",
    });

    console.log(event, access_token, refresh_token);

    calendar.events.insert(
      {
        auth: this.oAuth2Client,
        calendarId: "primary",
        requestBody: event,
      },
      (err: any, event: any) => {
        if (err) {
          console.error("Error creating event:", err);
          return;
        }
        console.log("Event created:", event.data.htmlLink);
      },
    );
  }

  async refreshTheToken(refresh_token: string) {
    return axios
      .post<{
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: "Bearer";
      }>("https://www.googleapis.com/oauth2/v4/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token,
        grant_type: "refresh_token",
      })
      .then(res => res.data);
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
