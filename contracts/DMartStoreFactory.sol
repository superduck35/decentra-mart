pragma solidity ^0.4.23;

import "./DMartStore.sol";
import "./Proxy.sol";

/**
 * @title DMart Store Factory
 * @author Alex Scott (@alsco77)
 * @dev Factory for creating DMart Stores 
 * Removes overhead of deploying full bytecode
 */
contract DMartStoreFactory {
    DMartStore private masterCopy;

   /** 
      * @dev Contract constructor
      * @param _masterCopy Address of deployed master copy of Store contract
      */
    constructor(DMartStore _masterCopy) public {
        require(_masterCopy != address(0), "address must be non null");
        masterCopy = _masterCopy;
    }

   /** 
      * @dev Creates a DMart Store instance
      * @param _owner Address of person who owns the store
      * @param _name Name of the store
      * @return Address of created contract
      */
    function createDMartStore(address _owner, string _name)
        public
        returns (DMartStore dMartStore)
    {
        dMartStore = DMartStore(new Proxy(masterCopy));
        dMartStore.init(_owner, _name);
        return dMartStore;
    }
}