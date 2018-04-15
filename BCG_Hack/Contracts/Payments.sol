pragma solidity ^0.4.21;


contract executePayment{

    // each car would have their wallet for storing tokens
    mapping(address => car_wallet) public cars;

    address public admin;

    function  executePayment(){
         admin = msg.sender;
    }

    // each car has token and insurance premium
    struct car_wallet{
        uint token;
        uint8 premium;
    }

    modifier enoughBalance(address _backcar) {
        require(cars[_backcar].token > 1000);
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // each car needs to be registered beofore they go on the road
    function register() public {
        cars[msg.sender].token = 10000; // every car assigned 10000 usd
        cars[msg.sender].premium = 10; // premium as score
    }

    function getWallet(address _car) public view returns(uint, uint8){
        return (cars[_car].token, cars[_car].premium);
    }

    function refill(address _car, uint _token) public onlyAdmin{
        cars[_car].token += _token;
    }

    function execution(address _frontcar, address _backcar, uint _token) public enoughBalance(_backcar) returns(uint,uint){
        // payments
        cars[_frontcar].token += _token;
        cars[_backcar].token -= _token;

        // premium
        cars[_backcar].premium += 1;

        return (cars[_frontcar].token, cars[_backcar].token);
    }
}
