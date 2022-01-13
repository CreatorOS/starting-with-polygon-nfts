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