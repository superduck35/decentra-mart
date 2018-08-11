pragma solidity ^0.4.23;

import "../installed_contracts/zeppelin/contracts/ownership/Ownable.sol";


// Have a DMartStore factory/proxy create deletable, upgradable store contract for each new store being created (only owner can call any func)
contract DMartStore is Ownable {

    string public name;    

    // check owner is applied
    constructor(string _name) public {
        name = _name;
    }

    function getName() public
    view
    returns(string) {
        return(name);
    }

    function getOwner() public
    view
    returns(address) {
        return(owner);
    }
}