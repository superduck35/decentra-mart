pragma solidity ^0.4.23;

import "./DMartStore.sol";

contract DMartAdmin {
    function hasRole(address addr, string roleName) external view returns (bool);
}

contract DMartStoreManagement {

    DMartAdmin admin;

    string public constant ROLE_ADMIN = "Admin";
    string public constant ROLE_STORE_OWNER = "Store Owner";

    mapping(address => address[]) private storesByOwner;

    event StoreAdded(address indexed store, string name);

    constructor(DMartAdmin _admin) public {
        admin = DMartAdmin(_admin);
    }

    function getStoresByOwner(address _storeOwner) public
    view
    returns(address[]) {
        return storesByOwner[_storeOwner];
    }

    function addStore(string _storeName) public
    returns(address) { 
        require(admin.hasRole(msg.sender, ROLE_STORE_OWNER));
        // add store in here
        DMartStore store = new DMartStore(_storeName);
        store.transferOwnership(msg.sender);
        storesByOwner[msg.sender].push(store);
        emit StoreAdded(store, _storeName);
        return store;        
    }
}