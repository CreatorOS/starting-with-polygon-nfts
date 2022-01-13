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
