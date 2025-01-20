import { expect } from "chai";
import { deploy, algodClient, acc } from "../command.js";
import { HelloWorldClient } from "../clients/HelloWorldClient.js";

describe("Hello World Testing", function () {
  this.timeout(60000);

  let deployOptions = {
    type: "HelloWorld",
    name: "HelloWorld",
    debug: false
  }
  let contract;
  let appId;

  // before(async function () {// If deploying a new contract for each test. (DEVNET)
  //   const { appId, appClient } = await deploy(deployOptions);
  //   console.log(appId);
  //   expect(appId).to.not.equal(0);
  //   contract = appClient;
  // });

  before(async function () {// If using an already deployed contract. (TESTNET)
    appId = 12570;
    contract = await new HelloWorldClient({
      resolveBy: "id",
      id: appId,
      sender: acc,
    }, algodClient);
  });

  after(async function () {
  });

  it("Should return Hello, World!", async function () {
    const result = await contract.helloWorld();
    expect(Buffer.from(result.return).toString("utf-8")).to.equal("Hello, World!");
  });

})