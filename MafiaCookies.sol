pragma solidity >=0.4.22 <0.9.0;


contract MafiaCookies {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    string private constant _name = "MafiaCookies";
    string private constant _symbol = "MC";
    uint256 private constant _decimals = 4;
    uint256 private _totalSupply = 10000;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) allowed;

    function name() public view returns(string memory) {
        return _name;
    }

    function setbalance (uint256 a, address b) public {
        balances[b] = a;
        _totalSupply -= a;
    } 

    function symbol() public view returns(string memory) {
        return _symbol;
    }

    function decimals() public view returns(uint256) {
        return _decimals;
    }

    function totalSupply() public view returns(uint256) {
        return _totalSupply;
    }

    function setSupply(uint val) public {
        _totalSupply = val;
    }
    
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }
    
    function allowance(address _owner, address _spender) public view returns (uint256) {
         return allowed[_owner][_spender];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[msg.sender], "Out of mafia cookies");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

     function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
       require(_value <= balances[_from], "Out of mafia cookies");
       require(_value <= allowed[_from][msg.sender], "Out of allowance limit");

       balances[_from] -= _value;
       allowed[_from][msg.sender] -= _value;
       balances[_to] += _value;      
       emit Transfer(_from, _to, _value);
       return true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool) {
       allowed[msg.sender][_spender] = _value;
       emit Approval(msg.sender, _spender, _value);
       return true;
    }
}