pragma solidity ^0.4.23;

import "./DMartStore.sol";
import "./Proxy.sol";

contract DMartStoreFactory {
    DMartStore private masterCopy;

    constructor(DMartStore _masterCopy) public {
        masterCopy = _masterCopy;
    }

    function createDMartStore(address _owner, string _name, uint _fillAmount, uint _capacity)
        public
        returns (DMartStore dMartStore)
    {
        dMartStore = DMartStore(new Proxy(masterCopy));
        dMartStore.init(_owner, _name, _fillAmount, _capacity);
    }
}