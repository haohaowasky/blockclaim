pragma solidity ^0.4.21;

contract carData{

    // database saves data when accident happens
    mapping(address => bytes32[]) public database;

    function getCardata(address _car) public view returns(bytes32[]){
        return database[_car];
    }

    // postData
    function postData(bytes32 _hash) public {
        database[msg.sender].push(_hash);
}

}
