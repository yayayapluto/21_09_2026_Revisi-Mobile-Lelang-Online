import type {Mandatory} from "./mandatory";
import type {Item} from "./item";

export type ObjectType = Mandatory & {
    name: string
    items: Item[] | null
}