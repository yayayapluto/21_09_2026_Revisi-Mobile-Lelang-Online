import {createContext} from "react";
import type {User} from "../../types/user";

export const AuthDataContext = createContext<User | undefined>(undefined);
