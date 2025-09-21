import type {Mandatory} from "./mandatory";
import type {Organizer} from "./organizer";

export type User = Mandatory & {
    username: string;
    email: string;
    organizer?: Organizer;
    last_login_at?: Date;
}