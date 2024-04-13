import { Plumber, PlumberSchema } from "@models/plumber.schema";
import { PlumberProfile, PlumberProfileSchema } from "@models/plumberprofile.schema";
import { Service, ServiceSchema } from "@models/service.schema";
import { User, UserSchema } from "@models/user.schema";
import { UserProfile, UserProfileSchema } from "@models/userprofile.schema";
import { Appointments, AppointmentsSchema } from "@models/appointment.schema";
import { Event, EventSchema } from "@models/events.schema";

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
  {
    name: PlumberProfile.name,
    schema: PlumberProfileSchema,
  },
  {
    name: Service.name,
    schema: ServiceSchema,
  },
  {
    name: Appointments.name,
    schema: AppointmentsSchema,
  },
  {
    name: Event.name,
    schema: EventSchema,
  },
];
