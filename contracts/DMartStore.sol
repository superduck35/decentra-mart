pragma solidity ^0.4.23;

import "../installed_contracts/zeppelin/contracts/ownership/Ownable.sol";
import "../installed_contracts/zeppelin/contracts/math/SafeMath.sol";
import "./Proxy.sol";

/**
 * @title DMart Store
 * @author Alex Scott (@alsco77)
 * @dev Manage role access for usage with DMartStore contracts
 */
contract DMartStore is ProxyData, Ownable {

    bool private isInitialised;
    
    string public name;
    bool public open;

    struct Product{
        uint256 id;
        string name;
        uint price;
        uint16 stock;
        bool active;
    }

    //TODO: View all products
    Product[] public products;

    event ProductAdded(uint256 indexed id, string name, uint price, uint16 stock);
    event ProductDeactivated(uint256 indexed id);
    event ProductPriceUpdated(uint256 indexed id, uint price);
    event ProductPurchased(uint256 indexed id, uint16 stock);

    event StoreOpened();
    event StoreClosed();

    /** @dev Default constructor for base template */
    constructor(string _name) public {
        init(msg.sender, _name);
    }


    modifier storeIsOpen() {
        require(open);
        _;
    }

    modifier storeIsClosed() {
        require(!open);
        _;
    }

    modifier productExists(uint256 _productId) {
        require(products.length > _productId);
        _;
    }

    modifier productIsActive(uint256 _productId) {
        require(products[_productId].active == true);
        _;
    }

    modifier productHasStock(uint256 _productId) {
        require(products[_productId].stock > 0);
        _;
    }

    /** 
      * @dev Initialises the store, called from Factory
      * @param _owner Owner of the store
      * @param _name Name of the store
      */
    function init(address _owner, string _name) public {
        require(!isInitialised);
        owner = _owner;
        name = _name;
        isInitialised = true;
        open = true;
    }

    function addNewProduct(string _name, uint _price, uint16 _stock) public 
    onlyOwner
    returns (bool) {
        require(_stock > 0 && _price > 0 && bytes(_name).length > 0);
        uint256 id = products.length;
        products.push(Product(id, _name, _price, _stock, true));
        emit ProductAdded(id, _name, _price, _stock);
        return true;
    }

    function removeProduct(uint256 _productId) public 
    onlyOwner
    productIsActive(_productId) {
        products[_productId].active = false;
        emit ProductDeactivated(_productId);
    }

    function changePrice(uint256 _productId, uint _newPrice) external
    onlyOwner 
    productIsActive(_productId) {
        require(_newPrice > 0);
        products[_productId].price = _newPrice;
        emit ProductPriceUpdated(_productId, _newPrice);
    }

    function getProduct(uint256 _productId) external
    view
    storeIsOpen
    returns(uint256, string, uint, uint16, bool) {
        return (
            products[_productId].id,
            products[_productId].name,
            products[_productId].price,
            products[_productId].stock,
            products[_productId].active
        );
    }

    function withdrawEther() external 
    onlyOwner {
        owner.transfer(address(this).balance);
    }

    function closeStore() external
    onlyOwner
    storeIsOpen {
        open = false;
        emit StoreClosed();
    }

    function reOpenStore() external
    onlyOwner
    storeIsClosed {
        open = true;
        emit StoreOpened();
    }

    function purchaseProduct(uint256 _productId) external
    payable
    storeIsOpen 
    productIsActive(_productId)
    productHasStock(_productId) {
        require(msg.value >= products[_productId].price);

        products[_productId].stock -= 1;

        emit ProductPurchased(_productId, products[_productId].stock);
    }

    function getMeta() external
    view
    returns(string, bool) {
        return(
            name,
            open
        );
    }

    function getBalance() external
    onlyOwner
    returns(uint) {
        return address(this).balance;
    }
}