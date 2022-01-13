# Starting with Polygon NFTs
Hello my dear friend who is lucky&smart enough to be here. In this quest, we will be looking at how to code and deploy NFTs to Polygon's Mumbai. We will assume that you have a basic knowledge of the ERC721 standard.
We will do the whole thing in Hardhat. So you know the drill, you have to set up a Hardhat project and connect to Polygon. Remember, you can always find the instructions in this track's first quest. But we need to do some extra stuff in hardhat.config.js: First, we will need three addresses that you control in this quest. So go ahead and add those three in Hardhat configuration. Second, make sure that your Solidity version is 0.8.0. Alright let's do this.

## Writing the contract:
We will rely on Openzeppelin's implementation of the ERC721 standard, so you will need to run this command:

``` npm install @openzeppelin/contracts ```

This will add Openzeppelin's contracts to your node modules, go and take a look. Now, ... Now what? Oh yes, the contract. create a _contracts_ directory, cd into it, create an _ImportantPeople.sol_. We will be creating NFTs that hold names of famous people:

```js
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FamousPeople is ERC721 {
    address public owner;
    uint256 public id;
    mapping(string => bool) thisPersonExists;

    constructor() ERC721("Really Important People", "RIP") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function mint(string memory importantPerson, address receiver)
        public
        onlyOwner
    {
        require(!thisPersonExists[importantPerson]);
        _mint(receiver, id);
        id++;
        thisPersonExists[importantPerson] = true;
    }
}
```

Let's break down what is happening above. In the constructor, you can see our collection's name and symbol. Notice that they are passed to the ERC721 constructor, Take a look at it to understand this. It just initilaizes name with "Really Important People" and symbol with "RIP". Did you get my pun??
Did you?

*sad geek laughs*

Alright, you can see the good old owner pattern. Nothing much I can say about this. Also, see that uint-to-bool mapping? This is just so that each token corresponds to a different famous person.
What on Earth is that (_mint) function?

## A few words on minting:
If you dig deep in ERC721.sol, you will see this:

```js
function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }
```

This is, arguably, the most important function in this standard. The functionality is simple, this is what people buy:

```js
_owners[tokenId] = to;
```
This is like a digital receipt that proves your ownership. Ok, let's test this FamousPeople guy.

## Testing:
In your _test_ directory, create a _Test.js_:

```js
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("Testing the FamousPeople contract", function () {
    this.timeout(120000);

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    let FamousPeople, famousPeople, signers, MrMinter, Alice, Bob
    it("should mint two NFTs", async () => {
        signers = await ethers.getSigners()
        MrMinter = signers[0]
        Alice = signers[1]
        Bob = signers[2]
        FamousPeople = await ethers.getContractFactory("FamousPeople")
        famousPeople = await FamousPeople.deploy()
        expect(await famousPeople.owner()).to.equal(MrMinter.address)
        await famousPeople.mint("Alice", Alice.address)
        await famousPeople.mint("Bob", Bob.address)
        sleep(30000)
        expect(await famousPeople.id()).to.equal(2)
    })
})
```

Usual stuff, You can see your three accounts being the minter, Alice, and Bob. Isn't this cool? 
Notice that we increased the testing timeout and forced the script to sleep before querying the id. Blockchains, right?
now run:

``` npx hardhat test ```

This will run on Hardhat's local network, just to make sure things add up.
Then the real stuff (almost, we are still on a test network):

``` npx hardhat test --network mumbai```

Now go make some tea, do 20 push ups, achieve world peace, and propose to the love of your life. Then go back to your terminal, it is possible that the command has finished executing.
Just kidding, but this process is a bit time-consuming, be patient.
Feel free to play around with the timeout&sleep stuff if the test didn't pass.

## Final remarks:
Alright that is all. But not exactly, stay tuned for more Polygon NFT quests. We will continue building on top of this quest. Good luck and happy coding!
