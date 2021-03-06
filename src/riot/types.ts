// This file contains incomplete definitions for Riot API dto's.
namespace riot {
    export interface Summoner {
        name: string;
        id: number;
        accountId: number;
        profileIconId: number;
    }

    export interface ChampionMasteryInfo {
        championPoints: number;
        championId: number;
    }

    export type ChampionData = {
        [key: number]: {
            id: number;
            key: string;
            name: string;
        };
    }

    export type LeagueEntry = {
        tier: string;
    }
}