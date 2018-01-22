pragma solidity ^0.4.17;

contract MetaCoin {

	uint public moon = 700;
	bytes32[] public data;

	struct Proposal {
		string propname;
		string Hash;
		string data;
	}

	Proposal public proposal;

	function MetaCoin() {

		proposal.propname="ConstructProp1";
		proposal.data="ConstructProp2";
		proposal.Hash="ConstructProp3";
	}

	function sendCoin() public{
		moon=moon+100;
	}

	function getBalance() public view returns(uint) {
		return moon;
	}
	
	function sendData(string propname, string data, string Hash) public{
		proposal.propname = propname;
		proposal.Hash = Hash;
		proposal.data = data;		
	}
	function getData() public view returns(string, string, string) {
		return (proposal.propname, proposal.data, proposal.Hash);
	}

}
