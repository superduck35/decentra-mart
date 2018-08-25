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
        uint id;
        string name;
        uint price;
        uint16 stock;
        bool active;
    }

    uint public numberOfProducts = 0;
    Product[] public products;

    event ProductAdded(uint indexed id, string name, uint price, uint16 stock);
    event ProductDeactivated(uint indexed id);
    event ProductPriceUpdated(uint indexed id, uint price);
    event ProductPurchased(uint indexed id, uint16 stock);

    event StoreOpened();
    event StoreClosed();

    /** @dev Default constructor for base template */
    constructor(string _name) public {
        init(msg.sender, _name);
    }
    
    /** 
      * @dev Initialises the store, called from Factory
      * @param _owner Owner of the store
      * @param _name Name of the store
      */
    function init(address _owner, string _name) public {
        require(!isInitialised, "Store must not be initialised");
        require(_owner != address(0), "Owner cannot be empty address");
        require(bytes(_name).length > 0, "Name must be non empty");
        owner = _owner;
        name = _name;
        isInitialised = true;
        open = true;
    }

    /** 
      * @dev Modifier - requires store to be open
      */
    modifier storeIsOpen() {
        require(open, "Store must be open");
        _;
    }
    /** 
      * @dev Modifier - requires store to be closed
      */
    modifier storeIsClosed() {
        require(!open, "Store must be closed");
        _;
    }
    /** 
      * @dev Modifier - requires product to exist in store
      */
    modifier productExists(uint _productId) {
        require(products.length > _productId, "Product must exist in store");
        _;
    }
    /** 
      * @dev Modifier - requires product to be active
      */
    modifier productIsActive(uint _productId) {
        require(products[_productId].active == true, "Product must be active");
        _;
    }
    /** 
      * @dev Modifier - requires product to have stock > 0
      */
    modifier productHasStock(uint _productId) {
        require(products[_productId].stock > 0, "Product must have stock");
        _;
    }

    /** 
      * @dev Get the basic store details
      * @return string name, bool isopen
      */
    function getMeta() external
    view
    returns(string, bool) {
        return(
            name,
            open
        );
    }

    /** 
      * @dev Add a new product to the store
      * @param _name Name of product
      * @param _price Price of product
      * @param _stock Amount of stock
      * @return bool adding success
      */
    function addNewProduct(string _name, uint _price, uint16 _stock) public 
    onlyOwner
    returns (bool) {
        require(bytes(_name).length > 0 && _price > 0 && _stock > 0, "Product details cannot be empty");
        uint id = numberOfProducts++;
        products.push(Product(id, _name, _price, _stock, true));
        emit ProductAdded(id, _name, _price, _stock);
        return true;
    }

    /** 
      * @dev Removes a product by deactivating it
      * @param _productId Id of product
      */
    function removeProduct(uint _productId) public 
    onlyOwner
    productIsActive(_productId) {
        products[_productId].active = false;
        emit ProductDeactivated(_productId);
    }

    /** 
      * @dev Change the price of a product
      * @param _productId Identifier
      * @param _newPrice Updated price
      */
    function changePrice(uint _productId, uint _newPrice) external
    onlyOwner 
    productIsActive(_productId) {
        require(_newPrice > 0, "New price must be greater than 0");
        products[_productId].price = _newPrice;
        emit ProductPriceUpdated(_productId, _newPrice);
    }

    /** 
      * @dev Get a products details
      * @param _productId Identifier
      * @return all Product fields
      */
    function getProduct(uint _productId) external
    view
    storeIsOpen
    returns(uint, string, uint, uint16, bool) {
        return (
            products[_productId].id,
            products[_productId].name,
            products[_productId].price,
            products[_productId].stock,
            products[_productId].active
        );
    }

    /** 
      * @dev Get all products
      * @return Ids of all products
      */
    function getProductIds() external
    view
    storeIsOpen
    returns(uint[]) {
        uint[] memory productIds = new uint[](numberOfProducts);
        for(uint i = 0; i < numberOfProducts; i++){
            productIds[i] = i;
        }
        return (
            productIds
        );
    }

    /** 
      * @dev Purchase a product from the store
      * @param _productId Product identifier
      */
    function purchaseProduct(uint _productId) external
    payable
    storeIsOpen 
    productIsActive(_productId)
    productHasStock(_productId) {
        require(msg.value >= products[_productId].price, "Message must contain value of product");

        products[_productId].stock -= 1;

        emit ProductPurchased(_productId, products[_productId].stock);
    }

    /** 
      * @dev Get the current balance of store
      * @return uint balance in wei
      */
    function getBalance() external
    view
    onlyOwner
    returns(uint) {
        return address(this).balance;
    }

    /** 
      * @dev Store owner can withdraw balance from sales
      */
    function withdrawStoreBalance() external 
    onlyOwner {
        owner.transfer(address(this).balance);
    }

    /** 
      * @dev Close the store for business
      */
    function closeStore() external
    onlyOwner
    storeIsOpen {
        open = false;
        emit StoreClosed();
    }

    /** 
      * @dev Open the store for business
      */
    function reOpenStore() external
    onlyOwner
    storeIsClosed {
        open = true;
        emit StoreOpened();
    }
}