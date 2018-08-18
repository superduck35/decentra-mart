pragma solidity ^0.4.23;

import "./access/RBAC.sol";
// import "../installed_contracts/simple-multisig/contracts/SimpleMultisig.sol";

// Set up the admin and store owner roles here, allow 3 admins to add a new admin? Then hook the DMartStoreOwner contract in to use the roles

contract DMartAdmin is RBAC {
    
    address[] public storeOwners;
    mapping(address => uint) indexOfStoreOwners;

    event StoreOwnerAdded(address indexed storeOwner);
    event StoreOwnerRemoved(address indexed storeOwner);

    string public constant ROLE_ADMIN = "Admin";
    string public constant ROLE_STORE_OWNER = "Store Owner";

    constructor() public {
        addRole(msg.sender, ROLE_ADMIN);
    }

    function addStoreOwner(address _storeOwner) public 
    onlyRole(ROLE_ADMIN) 
    returns (bool) {
        require(_storeOwner != address(0));
        require(!hasRole(_storeOwner, ROLE_STORE_OWNER));

        storeOwners.push(_storeOwner);
        indexOfStoreOwners[_storeOwner] = storeOwners.length - 1;

        addRole(_storeOwner, ROLE_STORE_OWNER);
        return(true);
    } 

    function removeStoreOwner(address _storeOwner) public 
    onlyRole(ROLE_ADMIN) 
    returns (bool) {
        require(_storeOwner != address(0));
        require(hasRole(_storeOwner, ROLE_STORE_OWNER));

        removeStoreOwnerFromArray(_storeOwner);
        removeRole(_storeOwner, ROLE_STORE_OWNER);
        return(true);
    }

    function removeStoreOwnerFromArray(address _storeOwnerToDelete) private 
    onlyRole(ROLE_ADMIN) {
        uint index = indexOfStoreOwners[_storeOwnerToDelete];
        if (index < 0) return;

        if (storeOwners.length > 1) {
            storeOwners[index] = storeOwners[storeOwners.length-1];
            delete(storeOwners[storeOwners.length-1]); // recover gas
        }

        storeOwners.length--;
    }
}
