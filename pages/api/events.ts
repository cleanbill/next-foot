import { NextRequest, NextResponse } from "next/server";
import { EventItem } from "../../components/eventList";

export interface StateOfTheGame {
    message: string;
    events: Array<EventItem>;
    teamName: string;
    opponentName: string;
    timeDisplay: string;
    goals: number,
    opponentGoals: number
}

let cache: StateOfTheGame = {
    message: "Setting up the game",
    events: [],
    teamName: "Flames",
    opponentName: "The World",
    timeDisplay: "00:00",
    goals: 0,
    opponentGoals: 0
}

const log = (message: string, state = 'normal') => {
    const dtm = (new Date() + "").substring(0, 25);
    const output = dtm + ". " + message;
    if (state === 'error') {
        console.error(output);
    } else if (state == 'warn') {
        console.warn(output);
    } else {
        console.log(output);
    }
}

export default function handler(req: any, res: any) {
    log("Incoming " + req.method + " events request");
    if (req.method == 'GET') {
        log("   Getting events " + cache.timeDisplay);
        res.
            res.status(200).json(cache);
        return;
    }
    if (req.method == 'POST') {
        try {
            JSON.parse(req.body);
        } catch (er) {
            cache = req.body;
        }
        log("   New events " + cache.timeDisplay);
        res.status(200).json(cache);
        return;
    }
    log("   Bad event request " + req.method, 'warn');

    res.status(400).send({ message: req.method + ' not allowed' })
}