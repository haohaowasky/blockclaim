const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/teochFL5M5Cc6eidkmI5"));
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('https://ropsten.infura.io/teochFL5M5Cc6eidkmI5');

var data_abi = require('./abi_Data');

var data_contractAddress = '0x1618effaae7203edaa52aab952a24fcd8c39c307';

var private_key_Acar = "0x398ca564d427a3315b6536bbcff1390d69395b06ed6d486954e971d960fe8719";
var private_key_Bcar = "0x398ca564d427a3315z6536amcaf1390d69795b06ed6d486954e911d900fe8719"

// accounts for two cars, ideally, all the cars need address;
var A_account = web3.eth.accounts.privateKeyToAccount(private_key_Acar);
var B_account = web3.eth.accounts.privateKeyToAccount(private_key_Bcar);


var address_A =  A_account[Object.keys(A_account)[0]];
var address_B =  B_account[Object.keys(B_account)[0]];


// console.log("The A car address is: " + address_A);
// // console.log("The private key is: " + private_key);
// console.log("The B car address is: " + address_B);



web3.eth.getBalance(address_A, function(e, result){
  console.log("the balance of the account A is  " + result);
  console.log(web3.utils.fromWei(result, 'ether') + "ether");
});


web3.eth.getBalance(address_B, function(e, result){
  console.log("the balance of the account B is  " + result);
  console.log(web3.utils.fromWei(result, 'ether') + "ether");
});

var DataContract = new web3.eth.Contract(data_abi, data_contractAddress);


// getdata from function
// DataContract.methods.getCardata(address_A).call().then(function(Resp){
//   console.log(Resp);
// });

// get function ABI data


// sign transaction and send

function Send_Blockchain(hash, data_contractAddress, private_key_Acar){

  var getData = DataContract.methods.postData("0x"+ hash).encodeABI();
  console.log("the encode abi is  " + getData);

  var signed_transaction = web3.eth.accounts.signTransaction(

    {
      to: data_contractAddress,
      data:getData,
      gas: 3000000
    }, private_key_Acar).then(function(raw){

    web3.eth.sendSignedTransaction(raw[Object.keys(raw)[4]]).on('receipt', function(result){
      console.log(result);
  })

  })

}



var getData = DataContract.methods.postData("0x"+ hash).encodeABI();
console.log("the encode abi is  " + getData);

var signed_transaction = web3.eth.accounts.signTransaction(

  {
    to: data_contractAddress,
    data:getData,
    gas: 3000000,
  }, private_key_Acar).then(function(raw){

  web3.eth.sendSignedTransaction(raw[Object.keys(raw)[4]]).on('receipt', function(result){
    console.log(result);
})

})








//Send_Blockchain('459523a9ecd09a5884b693f3be50ae6889379268e608855908a9ef1e7a34f195',data_contractAddress,private_key_Bcar)
