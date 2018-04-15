const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/teochFL5M5Cc6eidkmI5"));
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('https://ropsten.infura.io/teochFL5M5Cc6eidkmI5');

var payment_abi = require('./abi_Payment');

var pay_contractAddress = '0x2a6b8ec741479f70099fe47a739dd5ea99d438e6';

var private_key_Acar = "0x398ca564d427a3315b6536bbcff1390d69395b06ed6d486954e971d960fe8719";
var private_key_Bcar = "0x398ca564d427a3315z6536amcaf1390d69795b06ed6d486954e911d900fe8719";
var Admin_key = "0x348ce564d427a3310b6536bbcff1390d69395b06ed6c486954e971d960fe8709";


// accounts for two cars, ideally, all the cars need address;
var A_account = web3.eth.accounts.privateKeyToAccount(private_key_Acar);
var B_account = web3.eth.accounts.privateKeyToAccount(private_key_Bcar);
var Admin_account = web3.eth.accounts.privateKeyToAccount(Admin_key);

var address_A =  A_account[Object.keys(A_account)[0]];
var address_B =  B_account[Object.keys(B_account)[0]];
var address_Admin = Admin_account[Object.keys(Admin_account)[0]];


var PaymentContract = new web3.eth.Contract(payment_abi, pay_contractAddress);


function register(PaymentContract,private_key ){
  var getData = PaymentContract.methods.register().encodeABI();
  console.log("the encode abi is  " + getData);
  var signed_transaction = web3.eth.accounts.signTransaction(

    {
      to: pay_contractAddress,
      data:getData,
      gas: 3000000
    }, private_key).then(function(raw){

    web3.eth.sendSignedTransaction(raw[Object.keys(raw)[4]]).on('receipt', function(result){
      console.log(result);
  })
  })
}

function execute(PaymentContract,private_key,frontCar,backCar,penalty){
  var getData = PaymentContract.methods.execution(frontCar,backCar,penalty).encodeABI();
  console.log("the encode abi is  " + getData);
  var signed_transaction = web3.eth.accounts.signTransaction(

    {
      to: pay_contractAddress,
      data:getData,
      gas: 3000000
    }, private_key).then(function(raw){

    web3.eth.sendSignedTransaction(raw[Object.keys(raw)[4]]).on('receipt', function(result){
      console.log(result);
  })
  })
}





// getdata from function
//register(PaymentContract, private_key_Bcar)

function show(PaymentContract,address_B,address_A){
PaymentContract.methods.getWallet(address_B).call().then(function(Resp){
  console.log("car B has balance of " + Resp[Object.keys(Resp)[0]] + " and Premium of " + Resp[Object.keys(Resp)[1]]);
});

PaymentContract.methods.getWallet(address_A).call().then(function(Resp){
  console.log("car A has balance of " + Resp[Object.keys(Resp)[0]] + " and Premium of " + Resp[Object.keys(Resp)[1]]);
});
}

show(PaymentContract,address_B,address_A);
