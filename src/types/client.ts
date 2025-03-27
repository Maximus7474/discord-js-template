import { Client as CL, Collection } from "discord.js";

export interface Client extends CL {
    commands?: Collection<string, { execute: (...args: any[]) => void }>;
}