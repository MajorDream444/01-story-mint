// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

/**
 * @title StoryMint
 * @notice Minimal ERC-721 with ERC-2981 royalties. TokenURI stored on-chain; metadata typically points to IPFS.
 */
contract StoryMint is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("Story Mint", "STORY") {}

    /**
     * @dev Mint to msg.sender with a tokenURI (e.g., ipfs://CID or data:application/json,...)
     */
    function mint(string memory tokenURI_) external returns (uint256) {
        _nextTokenId += 1;
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        return tokenId;
    }

    /** ---------- Royalty admin ---------- */

    /**
     * @dev Set default royalty receiver & fee (in basis points, e.g., 500 = 5%). Only owner.
     */
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /**
     * @dev Set per-token royalty. Only owner.
     */
    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    /**
     * @dev Clear default royalty. Only owner.
     */
    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }

    // Required override for Solidity multiple inheritance
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
