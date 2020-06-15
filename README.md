# CryptoKitties clone project

## Starter kit

### start your local ganache

```
ganache-cli --port 8545 --accounts 5  --mnemonic 'gesture rather obey video awake genuine patient base soon parrot upset lounge' --networkId 5777
```

### migrate the main contract to your local node

```
truffle migrate --network geth
```

### run your local server

```
cd client
python -m SimpleHTTPServer 8000
```

## Workflow

To make this project manageable the idea is to work with tags, most of the development will start from the dev branch.
Each step of the project will be developed on a stage branch "stage_1" "stage_2" ect.. Then merge on master with a tag associate to the stage.

### stage 1

Stage 1 is a simple interface to generate random kitties and save them on the cryptokitties smart contract.
This stage will contain the creation of the student frontend, a basic Factory smart contract, the npm package installation

## stage 2

The frontend will allow the student to create multiples gene 0 cats with a range slider, to select them individually.
The smart contract will be improve to track cats ownership

## stage 3

The frontend gives the user an option to make the cats the cats breeding.
The smart contract will use the parents DNA to create a new unic cat.
Do you want to include an oracle functionality with a random variable to give the cats Rare capabilities ?
it will be nice to introduce this concept which is not in the original cryptokitties app
We will also have to setup the cat cooldown.

## stage 4

A marketplace can be setup to sell your cats
