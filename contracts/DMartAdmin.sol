pragma solidity ^0.4.23;

import "./access/RBAC.sol";
import "../installed_contracts/simple-multisig/contracts/SimpleMultisig.sol";

// Set up the admin and store owner roles here, allow 3 admins to add a new admin? Then hook the DMartStoreOwner contract in to use the roles
// Have a DMartStore factory create deletable, upgradable store contract for each new store being created (only owner can call any func)

contract DMartAdmin is SimpleMultiSig, RBAC {
    
    constructor() public {
    }
}
