pragma solidity ^0.4.17;

contract MetaCoin {

	uint public moon = 700;


	function sendCoin() public{
		moon=moon+100;
	}

	function getBalance(uint amount) public view returns(uint) {
		return moon;
	}

}
