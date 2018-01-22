pragma solidity ^0.4.17;

import "./ConvertLib.sol";


contract MetaCoin {

	uint public moon = 700;

	enum Status{unset, consideration, revise, burned, funded}

	struct Proposal {
		string propname;
		string Hash;
		string data;
		Status status;
	}

	Proposal public proposal;

	function MetaCoin() {

		
		proposal.propname="notSet";
		proposal.data="notSet";
		proposal.Hash="notSet";
		proposal.status=Status.unset;
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
		proposal.status = Status.consideration;
				
	}
	function getData() public view returns(string, string, string, Status) {
		return (proposal.propname, proposal.data, proposal.Hash, proposal.status);
	}

}
