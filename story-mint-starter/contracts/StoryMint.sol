// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StoryMint is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("Story Mint", "STORY") {}

    function mint(string memory tokenURI_) external returns (uint256) {
        _nextTokenId += 1;
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        return tokenId;
    }
}
