pragma solidity ^0.4.23;

import "../installed_contracts/zeppelin/contracts/ownership/Ownable.sol";
import "./Proxy.sol";


// Have a DMartStore factory/proxy create deletable, upgradable store contract for each new store being created (only owner can call any func)

contract DMartStore is ProxyData, Ownable {

    event FilledKombucha(uint amountAdded, uint newFillAmount);
    event DrankKombucha(uint amountDrank, uint newFillAmount);

    uint public fillAmount;
    uint public capacity;
    string public name;

    constructor(string _name, uint _fillAmount, uint _capacity) public {
        init(msg.sender, _name, _fillAmount, _capacity);
    }

    function init(address _owner, string _name, uint _fillAmount, uint _capacity) public {
        require(capacity == 0 && _fillAmount <= _capacity && _capacity > 0); //TODO - add checks to ensure that the init method can only ever be called once
        owner = _owner;
        name = _name;
        fillAmount = _fillAmount;
        capacity = _capacity;
    }

    function fill(uint amountToAdd) public {
        uint newAmount = fillAmount + amountToAdd;
        require(newAmount > fillAmount && newAmount <= capacity);
        fillAmount = newAmount;
        emit FilledKombucha(amountToAdd, newAmount);
    }
    
    function drink(uint amountToDrink) public returns (bytes32) {
        uint newAmount = fillAmount - amountToDrink;
        require(newAmount < fillAmount);
        fillAmount = newAmount;
        emit DrankKombucha(amountToDrink, newAmount);
        // this mess of hashes just here to pad out the bytecode
        return keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
            keccak256(keccak256(keccak256(keccak256(keccak256(
                amountToDrink
            ))))))))))))))))))))))))))))))))))))))))))))))))));
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