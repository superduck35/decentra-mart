pragma solidity ^0.4.23;

import "./access/RBAC.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";

/**
 * @title DMart Admin controls 
 * @author Alex Scott (@alsco77)
 * @dev Manage role access for usage with DMartStore contracts
 */
contract DMartAdmin is RBAC, Pausable {
    
    address[] public storeOwners;
    mapping(address => uint) indexOfStoreOwners;

    string private constant ROLE_ADMIN = "Admin";
    string private constant ROLE_STORE_OWNER = "Store Owner";

    event StoreOwnerAdded(address indexed storeOwner);
    event StoreOwnerRemoved(address indexed storeOwner);


    /** @dev Basic contract constructor */
    constructor() public {
        addRole(msg.sender, ROLE_ADMIN);
    }

    /** 
      * @dev Grants admin role to specific address
      * @param _admin Address of user to receive role
      * @return bool Success of function
      */
    function addAdmin(address _admin) public 
    onlyOwner
    returns (bool) {
        require(_admin != address(0));
        require(!hasRole(_admin, ROLE_ADMIN));

        addRole(_admin, ROLE_ADMIN);
        return(true);
    }     
    
    /** @dev Revokes admin role from specific address
      * @param _admin Address of user to revoke role
      * @return bool Success of function
      */
    function removeAdmin(address _admin) public 
    onlyOwner
    returns (bool) {
        require(_admin != address(0));
        require(hasRole(_admin, ROLE_ADMIN));

        removeRole(_admin, ROLE_ADMIN);
        return(true);
    } 

    /** 
      * @dev Adds user as Store Owner
      * @param _storeOwner Address of user to receive role
      * @return bool Success of function
      */
    function addStoreOwner(address _storeOwner) public 
    whenNotPaused
    onlyRole(ROLE_ADMIN) 
    returns (bool) {
        require(_storeOwner != address(0));
        require(!hasRole(_storeOwner, ROLE_STORE_OWNER));

        storeOwners.push(_storeOwner);
        indexOfStoreOwners[_storeOwner] = storeOwners.length - 1;

        addRole(_storeOwner, ROLE_STORE_OWNER);
        return(true);
    } 

    /**
      * @dev Removes user as Store Owner
      * @param _storeOwner Address of store owner to revoke
      * @return bool Success of function
      */
    function removeStoreOwner(address _storeOwner) public 
    whenNotPaused
    onlyRole(ROLE_ADMIN) 
    returns (bool) {
        require(_storeOwner != address(0));
        require(hasRole(_storeOwner, ROLE_STORE_OWNER));

        removeStoreOwnerFromArray(_storeOwner);
        removeRole(_storeOwner, ROLE_STORE_OWNER);
        return(true);
    }

    /**
      * @dev Helper method to remove store owner from data access
      * @param _storeOwner Address of store owner
      */
    function removeStoreOwnerFromArray(address _storeOwnerToDelete) private 
    whenNotPaused
    onlyRole(ROLE_ADMIN) {
        uint index = indexOfStoreOwners[_storeOwnerToDelete];
        if (index < 0) return;

        if (storeOwners.length > 1) {
            storeOwners[index] = storeOwners[storeOwners.length-1];
            delete(storeOwners[storeOwners.length-1]); // recover gas
            delete(indexOfStoreOwners[_storeOwnerToDelete]);
        }

        storeOwners.length--;
    }
}
