import { expect } from "chai";
import { deploy } from "../command.js";

describe("Hello World Testing", function () {

  let deployOptions = {
    type: "HelloWorld",
    name: "HelloWorld",
    debug: false
  }
  let contract;
  let appId;

  beforeEach(async function () {
    const { id, appClient } = await deploy(deployOptions);
    appId = id;
    contract = appClient;
    expect(appId).to.not.equal(0);
  });

  afterEach(async function () {
  });

  it("Should return Hello, World!", async function () {
    const result = await contract.helloWorld();
    expect(Buffer.from(result.return).toString("utf-8")).to.equal("Hello, World!");
  });

  it("Should return Hello, You!", async function () {
    const result = await contract.helloYou({ you: "You!" });
    expect(Buffer.from(result.return).toString("utf-8")).to.equal("Hello, You!");
  })

  it("Should return Hello, You Again!", async function () {
    const result = await contract.helloYouAgain({ you: "You!", depth: 3 });
    expect(Buffer.from(result.return).toString("utf-8")).to.equal("Hello, You!, You!, You!");
  })


})