// server.js
// BASE SETUP
// =============================================================================
// call the packages we need

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors')
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/teochFL5M5Cc6eidkmI5"));
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('https://ropsten.infura.io/teochFL5M5Cc6eidkmI5');

var data_abi = require('./abi_Data');
var payment_abi = require('./abi_Payment');
var pay_contractAddress = '0x2a6b8ec741479f70099fe47a739dd5ea99d438e6';
var data_contractAddress = '0x1618effaae7203edaa52aab952a24fcd8c39c307';

var private_key_Acar = "0x398ca564d427a3315b6536bbcff1390d69395b06ed6d486954e971d960fe8719";
var private_key_Bcar = "0x398ca564d427a3315z6536amcaf1390d69795b06ed6d486954e911d900fe8719"
var Admin_key = "0x348ce564d427a3310b6536bbcff1390d69395b06ed6c486954e971d960fe8709";

// accounts for two cars, ideally, all the cars need address;
var A_account = web3.eth.accounts.privateKeyToAccount(private_key_Acar);
var B_account = web3.eth.accounts.privateKeyToAccount(private_key_Bcar);
var Admin_account = web3.eth.accounts.privateKeyToAccount(Admin_key);


var address_A =  A_account[Object.keys(A_account)[0]];
var address_B =  B_account[Object.keys(B_account)[0]];
var address_Admin = Admin_account[Object.keys(Admin_account)[0]];

var DataContract = new web3.eth.Contract(data_abi, data_contractAddress);
var PaymentContract = new web3.eth.Contract(payment_abi, pay_contractAddress);

//var dynamoDB = require('./app/models/dynamoDB').DynamoDB(credentials)
//var attr = require('dynamodb-data-types').AttributeValue;
//var dynamoDB = require('dynamodb').ddb(credentials);

var AWS = require("aws-sdk");
var request = require('sync-request');
var credentials = { accessKeyId : "",
                    secretKey   : "",
                    region: ""};

var response = request('GET', 'http://169.254.169.254/latest/meta-data/iam/security-credentials/dynamoDBAccess');
var instanceInfo = request('GET', 'http://169.254.169.254/latest/dynamic/instance-identity/document');
var jsonData = JSON.parse(response.body.toString('utf-8'));
var jsonInstanceInfo = JSON.parse(instanceInfo.body.toString('utf-8'));

console.log("region="+jsonInstanceInfo.region);

credentials.accessKeyId = jsonData.AccessKeyId;
credentials.secretKey = jsonData.SecretAccessKey;
credentials.region = jsonInstanceInfo.region;

AWS.config.update(credentials);
var dynamoDB = new AWS.DynamoDB();

AWS.config.update(credentials);
var dynamoDB = new AWS.DynamoDB();
var crypto = require ('crypto');
//var step = require('step');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(cors());
app.use(bodyParser.urlencoded({ limit:"10mb", extended: true }));
app.use(bodyParser.json({limit:"10mb"}));
//app.use(bodyParser());


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
            res.json({ message: 'api is live' });
  });

router.put('/incident/:hashkey',function(req, res) {
    var hashkey=req.params.hashkey;
    var incidentInfo=req.body;

    //console.log(req.body);
    if (hashkey == undefined || incidentInfo == undefined )
      res.send ("undefined hashkey or incidentInfo");

    var incidentInfoStr = JSON.stringify(incidentInfo,null,2);
    var jsonObj = JSON.parse(incidentInfoStr);
    //var hash = crypto.createHash('md5').update(templateStr).digest('hex');


    var item = {
                TableName: "car_info",
                Item: {
                  "data_hash": hashkey,
                  "incidentInfo": incidentInfoStr
                }
    };
    console.log(item);

    var docClient = new AWS.DynamoDB.DocumentClient();

    docClient.put(item, function(err, result) {
        if(err) {
            console.log(err);
            res.send(err);
          }
        else {
              //var jsonStr = JSON.stringify(result, null, 2);
              //console.log(result);
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

              var getData = PaymentContract.methods.execution(address_A,address_B,100).encodeABI();
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

              res.send("saved");

            }

      });
});


router.get('/incident/:hashkey', function(req, res) {
  var tId=req.params.hashkey;

  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log("Querying incident info " + tId);

  var params = {
      TableName : "car_info",
      KeyConditionExpression: "#data_hash = :xxxx",
      ExpressionAttributeNames:{
          "#data_hash": "hashkey"
      },
      ExpressionAttributeValues: {
          ":xxxx":tId
      }
  };
  docClient.query(params, function(err, result) {
        if(err) {
          console.log(err);
          res.send (err);
        }
      else {
        //console.log(result.Items);
        res.send (result.Items[0].incidentInfo);
      }
  });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
