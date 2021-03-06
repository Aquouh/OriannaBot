import express = require("express");
import { UserModel, LeagueAccountModel, ScoreDeltaModel } from "../../database";
import { Database } from "basie";

// GET '/api/user/:code'
export async function userGet(req: express.Request, res: express.Response) {
    const user = await UserModel.findBy({ configCode: req.params.code });
    res.status(user ? 200 : 404).send(user);
}

// PUT '/api/user/:code/settings'
export async function userSettingsPut(req: express.Request, res: express.Response) {
    const user = await UserModel.findBy({ configCode: req.params.code });
    if (!user) throw new Error("User not found.");

    user.optedOutOfTierRoles = req.body.optedOutOfTierRoles;
    user.optedOutOfReminding = req.body.optedOutOfReminding;

    await user.save();

    // Do not wait for this to finish, since it delays the request.
    // However, do update the user since they will expect their actions to have some result.
    this.discord.updater.updateUser(user, true);

    res.send();
}

// PUT '/api/user/:code/account'
export async function userPut(req: express.Request, res: express.Response) {
    const user = await UserModel.findBy({ configCode: req.params.code });
    if (!user) throw new Error("User not found.");

    await user.addAccount(req.body.region, {
        id: req.body.summonerId,
        name: req.body.summonerName,
        accountId: req.body.accountId
    });

    // Do not wait for this to finish, since it delays the request.
    // However, do update the user since they will expect their actions to have some result.
    this.discord.updater.updateUser(user, true);

    res.send();
}

// DELETE '/api/user/:code'
export async function userDelete(req: express.Request, res: express.Response) {
    const user = await UserModel.findBy({ configCode: req.params.code });
    if (!user) throw new Error("User not found.");

    const account = await LeagueAccountModel.findBy({ owner: user.id, region: req.body.region, summonerId: req.body.summonerId, accountId: req.body.accountId });
    if (!account) throw new Error("Account not found.");

    await account.destroy();

    // Do not wait for this to finish, since it delays the request.
    // However, do update the user since they will expect their actions to have some result.
    this.discord.updater.updateUser(user, true);

    res.send();
}