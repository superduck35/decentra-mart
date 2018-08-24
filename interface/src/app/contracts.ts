declare let require: any;

const adminAbi = require('../assets/DMartAdmin.json').abi;
const storeAbi = require('../assets/DMartStore.json').abi;
const managementAbi = require('../assets/DMartStoreManagement.json').abi;

export {
  adminAbi,
  storeAbi,
  managementAbi
};
