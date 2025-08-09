// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

/**
 * @title RoyaltySplitter
 * @dev Receives ERC-2981 royalty payouts (in native coin or ERC20) and lets payees withdraw pro-rata.
 * Usage: set this contract as the royalty receiver in StoryMint (setDefaultRoyalty).
 */
contract RoyaltySplitter is PaymentSplitter {
    constructor(address[] memory payees, uint256[] memory shares_)
        PaymentSplitter(payees, shares_) {}
}
