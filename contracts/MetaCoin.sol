pragma solidity ^0.4.17;

contract MetaCoin {

	mapping (address => uint) reputation;
	mapping (address => uint) power;

	enum Status{unset, consideration, revise, burned, funded}


	struct Proposal {

		string propname;
		string Hash;
		string data;
		Status status;
		address owner;
	}

	Proposal public proposal;
	uint public coolDown;

	function MetaCoin() {

		reputation[tx.origin]=1000;
		power[tx.origin]=reputation[tx.origin]/100;
		proposal.propname="notSet";
		proposal.data="notSet";
		proposal.Hash="notSet";
		proposal.status=Status.unset;
		coolDown=now;
	}

	function sendCoin() public{
		reputation[msg.sender] += 100;
	}

	function getReputation() public view returns(uint) {
		return reputation[msg.sender];
	}

	function getPower() public view returns(uint) {
		if(now>coolDown+1){
		power[msg.sender]=reputation[msg.sender]/100;
		}
		return power[msg.sender];
	}

	function usePower() public{
		power[msg.sender] = 1;
		coolDown=now;
	}

	function sendData(string propname, string data, string Hash) public{
		proposal.propname = propname;
		proposal.Hash = Hash;
		proposal.data = data;
		proposal.status = Status.consideration;
		proposal.owner=msg.sender;
				
	}
	function getData() public view returns(string, string, string, Status) {
		return (proposal.propname, proposal.data, proposal.Hash, proposal.status);
	}

}
