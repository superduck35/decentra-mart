pragma solidity ^0.4.23;

import "./DMartStoreFactory.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";

contract DMartAdmin {
    function hasRole(address addr, string roleName) external view returns (bool);
    function removeStoreOwner(address _storeOwner) external returns (bool); 
}

/**
 * @title DMart Store Management
 * @author Alex Scott (@alsco77)
 * @dev Backbone of marketplace, create, close and access list of stores
 */
contract DMartStoreManagement is Pausable {

    DMartAdmin private admin;
    DMartStoreFactory private storeFactory;

    string private constant ROLE_ADMIN = "Admin";
    string private constant ROLE_STORE_OWNER = "Store Owner";

    mapping(address => address[]) private storesByOwner;

    event StoreAdded(address indexed owner, address indexed store, string name);
    event StoreDeleted(address indexed owner, address indexed store);

   /** 
      * @dev Simple contract constructor
      * @param _admin Address of Admin contract
      * @param _storeFactory Address of store factory
      */
    constructor(DMartAdmin _admin, DMartStoreFactory _storeFactory) public {
        require(_admin != address(0) && _storeFactory != address(0), "Addresses must be non null");
        admin = DMartAdmin(_admin);
        storeFactory = DMartStoreFactory(_storeFactory);
    }

   /** 
      * @dev Get all stores owned by a user
      * @param _storeOwner Address of owner
      * @return Array of store addresses
      */
    function getStoresByOwner(address _storeOwner) public
    whenNotPaused
    view
    returns(address[]) {
        return storesByOwner[_storeOwner];
    }

   /** 
      * @dev Create a store and add it to my collection
      * @param _storeName Name of store to create
      * @return Address of new store
      */
    function addStore(string _storeName) public
    whenNotPaused
    returns(bool success) { 
        require(admin.hasRole(msg.sender, ROLE_STORE_OWNER));
        
        DMartStore store = storeFactory.createDMartStore(msg.sender, _storeName);
        storesByOwner[msg.sender].push(store);
        emit StoreAdded(msg.sender, store, _storeName);
        return true;
    }

   /** 
      * @dev Delete a store owner and remove all his stores
      * @param _storeOwner Address of owner to delete
      * @return Success of function
      */
    function deleteStoreOwner(address _storeOwner) public
    whenNotPaused
    returns(bool){
        require(admin.hasRole(msg.sender, ROLE_ADMIN));
        require(admin.removeStoreOwner(_storeOwner));

        if(storesByOwner[_storeOwner].length > 0){
            for(uint i = 0; i < storesByOwner[_storeOwner].length; i++) {
                emit StoreDeleted(_storeOwner, storesByOwner[_storeOwner][i]);
            }
            delete(storesByOwner[_storeOwner]);
        }
        return true;
    }
}