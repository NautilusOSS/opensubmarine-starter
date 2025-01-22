import { Command } from "commander";
import { HelloWorldClient, APP_SPEC as HelloWorldSpec, } from "./clients/HelloWorldClient.js";
import algosdk from "algosdk";
import { CONTRACT } from "ulujs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
// function that takes string and returns a Uint8Array of size n
export function stringToUint8Array(str, length) {
    const bytes = new Uint8Array(length);
    bytes.set(new Uint8Array(Buffer.from(str, "utf8")), 0);
    return bytes;
}
const makeABI = (spec) => {
    return {
        ...spec.contract,
        events: [],
    };
};
export const program = new Command();
const { MN } = process.env;
export const acc = algosdk.mnemonicToSecretKey(MN || "");
export const { addr, sk } = acc;
export const addressses = {
    deployer: addr,
};
export const sks = {
    deployer: sk,
};
// DEVNET
const ALGO_SERVER = "http://localhost";
const ALGO_PORT = 4001;
const ALGO_INDEXER_SERVER = "http://localhost";
const ALGO_INDEXER_PORT = 8980;
// TESTNET
// const ALGO_SERVER = "https://testnet-api.voi.nodely.dev";
// const ALGO_INDEXER_SERVER = "https://testnet-idx.voi.nodely.dev";
// MAINNET
// const ALGO_SERVER = "https://mainnet-api.voi.nodely.dev";
// const ALGO_INDEXER_SERVER = "https://mainnet-idx.voi.nodely.dev";
const algodServerURL = process.env.ALGOD_SERVER || ALGO_SERVER;
const algodServerPort = process.env.ALGOD_PORT || ALGO_PORT;
export const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN ||
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", algodServerURL, algodServerPort);
const indexerServerURL = process.env.INDEXER_SERVER || ALGO_INDEXER_SERVER;
const indexerServerPort = process.env.INDEXER_PORT || ALGO_INDEXER_PORT;
export const indexerClient = new algosdk.Indexer(process.env.INDEXER_TOKEN || "", indexerServerURL, indexerServerPort);
const signSendAndConfirm = async (txns, sk) => {
    const stxns = txns
        .map((t) => new Uint8Array(Buffer.from(t, "base64")))
        .map(algosdk.decodeUnsignedTransaction)
        .map((t) => algosdk.signTransaction(t, sk));
    await algodClient.sendRawTransaction(stxns.map((txn) => txn.blob)).do();
    return await Promise.all(stxns.map((res) => algosdk.waitForConfirmation(algodClient, res.txID, 4)));
};
const makeCI = (appId, spec) => {
    const ci = new CONTRACT(appId, algodClient, indexerClient, makeABI(spec), {
        addr: addr,
        sk: sk,
    });
    return ci;
};
export const deploy = async (options) => {
    if (options.debug) {
        console.log(options);
    }
    const deployer = {
        addr: addr,
        sk: sk,
    };
    let Client;
    switch (options.type) {
        case "HelloWorld": {
            Client = HelloWorldClient;
            break;
        }
    }
    const clientParams = {
        resolveBy: "creatorAndName",
        findExistingUsing: indexerClient,
        creatorAddress: deployer.addr,
        name: options.name || "",
        sender: deployer,
    };
    const appClient = Client ? new Client(clientParams, algodClient) : null;
    if (appClient) {
        const app = await appClient.deploy({
            deployTimeParams: {},
            onUpdate: "update",
            onSchemaBreak: "fail",
        });
        return { appId: app.appId, appClient: appClient };
    }
};
program
    .command("deploy")
    .requiredOption("-t, --type <string>", "Specify factory type")
    .requiredOption("-n, --name <string>", "Specify contract name")
    .option("--debug", "Debug the deployment", false)
    .description("Deploy a specific contract type")
    .action(async (options) => {
    const apid = await deploy(options);
    if (!apid) {
        console.log("Failed to deploy contract");
        return;
    }
    console.log(apid);
});
export const mint = async (options) => {
    const ci = makeCI(options.appId, HelloWorldSpec);
    ci.setPaymentAmount(1e6 + 28500);
    const mintR = await ci.mint(options.receiver, stringToUint8Array(options.name, 32), stringToUint8Array(options.symbol, 8), options.decimals, options.totalSupply);
    if (options.debug) {
        console.log(mintR);
    }
    if (mintR.success) {
        if (!options.simulate) {
            await signSendAndConfirm(mintR.txns, sk);
        }
        return true;
    }
    return false;
};
export const arc200_balanceOf = async (options) => {
    const ci = makeCI(options.appId, HelloWorldSpec);
    const arc200_balanceOfR = await ci.arc200_balanceOf(options.address);
    if (arc200_balanceOfR.success) {
        return arc200_balanceOfR.returnValue;
    }
    return BigInt(0);
};
