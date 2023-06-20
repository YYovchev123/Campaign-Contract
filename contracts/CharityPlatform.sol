// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Campaign.sol";

contract CharityPlatform {

    uint256 private id;
    mapping(uint256 => Campaign) public campaigns;

    function createCampaign(string memory name, string memory description, uint256 fundingGoal, uint256 deadline) public {
        require(fundingGoal > 0, "Inrease funding goal");
        require(deadline > 0, "Inrease deadline");
        require(bytes(name).length > 0, "Type in a name");
        require(bytes(description).length > 0, "Type in a description");
        id++;
        Campaign campaign = new Campaign(id, name, description, fundingGoal, deadline);
        campaigns[id] = campaign;
    }
}