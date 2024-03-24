import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export function getAuthInstance(): OAuth2Client {
  return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "postmessage");
}
