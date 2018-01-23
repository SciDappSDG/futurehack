pragma solidity ^0.4.17;

contract MetaCoin {

	mapping (address => uint) reputation;
	mapping (address => uint) power;
	mapping (address => Voter) public voters;

	enum Status{unset, consideration, revise, burned, funded}
	
	address[] public applicants;

	struct Proposal {

		string propname;
		string Hash;
		string data;
		Status status;
		address owner;
		uint voteCount;
	}

	    struct Voter {
        bool voted;
        uint vote;
    }

	mapping (address => Proposal) public proposal;	

	uint public coolDown;

	function MetaCoin() {

		reputation[tx.origin]=1000;
		power[tx.origin]=reputation[tx.origin]/100;
		proposal[tx.origin].propname="notSet";
		proposal[tx.origin].data="notSet";
		proposal[tx.origin].Hash="notSet";
		proposal[tx.origin].status=Status.unset;
		coolDown=now;
	}

	function sendCoin() public{
		reputation[msg.sender] += 100;
	}

	function getReputation() public view returns(uint) {
		return reputation[msg.sender];
	}

	function getPower() public view returns(uint) {
		if(now>coolDown+30){
		power[msg.sender]=reputation[msg.sender]/100;
		}
		return power[msg.sender];
	}

	function usePower() public {
		power[msg.sender] = 0;
		coolDown=now;
	}

	function sendData(string propname, string data, string Hash) public{
		proposal[msg.sender].propname = propname;
		proposal[msg.sender].Hash = Hash;
		proposal[msg.sender].data = data;
		proposal[msg.sender].status = Status.consideration;
		applicants.push(msg.sender);
				
	}
	function getData() public view returns(string, string, string, Status) {
		return (proposal[msg.sender].propname, proposal[msg.sender].data, proposal[msg.sender].Hash, proposal[msg.sender].status);
	}

	function getApplicants() public view returns(address[]) {
			return applicants;
	}

	function getProposal(address adr) public view returns(string, string, string) {
			return (proposal[adr].propname, proposal[adr].data, proposal[adr].Hash);
	}

	function vote(uint proposal) {
        Voter sender = voters[msg.sender];
        if (sender.voted)
            throw;
        sender.voted = true;
        sender.vote = proposal;

    }

}
