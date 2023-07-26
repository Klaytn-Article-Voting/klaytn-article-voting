// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

abstract contract InitData {

    struct Image {
        string title;
        string written_by;
        string category;
        string description;
        uint256 amountVote;
    }

    mapping(uint256 => address) public artistId;
    mapping(uint256 => Image) public imageId;

    string public baseURI;

    /**
     * Dummy data for event
     * In the future, we can accept the same from construction,
     * which will be called at the time of deployment
     */
    function _initializeData(uint256 index, Image memory data, address owner) internal  {
        imageId[index] = Image({
            title: data.title,
            written_by: data.written_by,
            category: data.category,
            description: data.description,
            amountVote: 0
        });
        artistId[index] = owner;
    }
}