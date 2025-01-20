# Getting Started

Edit the `contract.py` file to implement your desired contract using Python.
You can add other files and import them in the `contract.py` file as necessary.

# Compilation

1. Edit `generate_clients.sh`.
  - Update `artifacts` to match your contract name(s).
  - E.g. local artifacts=("HelloWorld")
  - E.g. local artifacts=("HelloWorld" "OtherContract" "AnotherContract")
2. In root directory run `source commands.sh`
3. In root directory run `build-all`
  - This will compile the contracts and put the teal and json files in the `artifacts` folder.
  - This will put the interface ts files into the `src/scripts/clients` folder.

# Testing

## Environment

You can test on either testnet or your local devnet.

It's a matter of updating the deploy options as outlined in the [Deployment](#deployment) section.

## Run Tests

1. Run `mocha` in root directory.

# Deployment

Update `command.ts` to match contract name(s). This file is a helper to deploy your compiled contracts to the network set in the file itself.

1. Set your mnemonic in the `acc` variable.
2. Import starting on line 2.
3. DeployType to match your contract name(s).
  - E.g. type DeployType = "HelloWorld";
  - E.g. type DeployType = "HelloWorld" | "OtherContract" | "AnotherContract";
4. options.type switch statement to match your contract name(s).
  - Ensure the case matches your DeployTypes in the previous step and you return the correct Client for your contract from the import statement in the first step.
5. If you get lint errrors for `algoClient` and `deploy` you can ignore.
6. To change network you deploy to change the `ALGO_SERVER` and `ALGO_INDEXER_SERVER` variables.
7. Run `npm i` in the `scripts` directory.
8. Run `npx tsc` in the `scripts` directory.
9. In the root directory run `cli deploy -t <contract name> -n <contract name>`
  - E.g. `cli deploy -t HelloWorld -n HelloWorld`
  - E.g. `cli deploy -t HelloWorld -n AnotherContract`
  - E.g. `cli deploy -t HelloWorld -n OtherContract`



