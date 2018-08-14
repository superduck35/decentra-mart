pragma solidity ^0.4.23;

import "./DMartStoreFactory.sol";

contract DMartAdmin {
    function hasRole(address addr, string roleName) external view returns (bool);
}

contract DMartStoreManagement {

    DMartAdmin admin;
    DMartStoreFactory storeFactory;

    string public constant ROLE_ADMIN = "Admin";
    string public constant ROLE_STORE_OWNER = "Store Owner";

    mapping(address => address[]) private storesByOwner; //TODO - consider better storage infrastructure (cryptoZombies?)

    event StoreAdded(address indexed store, string name);

    constructor(DMartAdmin _admin, DMartStoreFactory _storeFactory) public {
        admin = DMartAdmin(_admin);
        storeFactory = DMartStoreFactory(_storeFactory);
    }

    function getStoresByOwner(address _storeOwner) public
    view
    returns(address[]) {
        return storesByOwner[_storeOwner];
    }

    function addStore(string _storeName, uint _fill, uint _capacity) public
    returns(address) { 
        require(admin.hasRole(msg.sender, ROLE_STORE_OWNER));
        // add store in here
        DMartStore store = storeFactory.createDMartStore(msg.sender, _storeName, _fill, _capacity);
        storesByOwner[msg.sender].push(store);
        emit StoreAdded(store, _storeName);
        return store;        
    }
}