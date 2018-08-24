pragma solidity ^0.4.23;

contract TestHelper {

    
    // A little utility that runs a wrapped method invocation as an internal Solidity call
    // Returns true if the underlying call succeeds and false if it throws.
    function execute(string signature) public returns (bool){
        bytes4 sig = bytes4(keccak256(signature));
        address self = address(this);
        return self.call(sig);
    }
}