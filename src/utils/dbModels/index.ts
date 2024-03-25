import { Plumber, PlumberSchema } from "@models/plumber.schema";
import { User, UserSchema } from "@models/user.schema";
import { UserProfile, UserProfileSchema } from "@models/userprofile.schema";

export default [
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: UserProfile.name,
    schema: UserProfileSchema,
  },
  {
    name: Plumber.name,
    schema: PlumberSchema,
  },
];
