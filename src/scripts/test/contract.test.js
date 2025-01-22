import { expect } from "chai";
import {
  deploy,
  addr,
  stringToUint8Array,
  mint,
  arc200_balanceOf,
} from "../command.js";

describe("Hello World Testing", function () {
  const timestamp = Date.now();

  let deployOptions = {
    type: "HelloWorld",
    name: `HelloWorld-${timestamp}`,
    debug: false,
  };
  let contract;
  let appId;
  let counter = 0;

  beforeEach(async function () {
    const { id, appClient } = await deploy({
      ...deployOptions,
      name: `${deployOptions.name}-${counter++}`,
    });
    appId = id;
    contract = appClient;
    expect(appId).to.not.equal(0);
  });

  afterEach(async function () {});

  it("Should return Hello, World!", async function () {
    const result = await contract.helloWorld();
    expect(Buffer.from(result.return).toString("utf-8")).to.equal(
      "Hello, World!"
    );
  });

  it("Should return Hello, You!", async function () {
    const result = await contract.helloYou({ you: "You!" });
    expect(Buffer.from(result.return).toString("utf-8")).to.equal(
      "Hello, You!"
    );
  });

  it("Should return Hello, You Again!", async function () {
    const result = await contract.helloYouAgain({ you: "You!", depth: 3 });
    expect(Buffer.from(result.return).toString("utf-8")).to.equal(
      "Hello, You!, You!, You!"
    );
  });

  it("Should mint 100 tokens to the deployer", async function () {
    const appRef = await contract.appClient.getAppReference();
    const appId = appRef.appId;
    const result = await mint({
      appId,
      receiver: addr,
      name: "HelloWorld",
      symbol: "HW",
      decimals: 0,
      totalSupply: 100,
    });
    expect(result).to.equal(true);
    const balance = await arc200_balanceOf({
      appId,
      address: addr,
    });
    expect(balance).to.equal(BigInt(100));
  });
});
