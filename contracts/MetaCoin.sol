pragma solidity ^0.4.17;

//actually it is contract SciDapp, but for better tracebility of the changes, we stick to that name.

contract MetaCoin {

// We generate two mappings (functioning as ledgers), that will be our two tokens REPUTATION and POWER.
	mapping (address => int256) reputation;
	mapping (address => int256) power;

// Introducing the nested mapping for the voting logic. Voters should be able to vote only once, but for several proposals each.
// So we have a mapping that identifies one address (the one of the user) with one voter (the user), which contains a mapping of 
// addresses (the one of the proposals) with a bool, that indicates whether the voter has voted for a specific proposal

	mapping (address => Voter) voters;
	struct Voter {
		mapping (address => bool) votedFor;
    }
// these are the set of statuses the proposal can have

	enum Status{unset, consideration, revise, burned, funded}

// generating an array of applicant addresses, that we will use later to store the "index" of our proposal mappings. We need this to loop over in the
// js logic to display all proposals except the own one.	
	address[] public applicants;

// Proposal struct is generated. It has the submitted data, as well as the status and two vote related variables.
	struct Proposal {

		string propname;
		string Hash;
		string data;
		Status status;
		int256 voteCount; // this is the summation of vote values. a reject is -1, a revise is 0, a funded is +1, this will later on decide the status
		uint votesDone;	// counts how many addresses have submitted a vote.	
	}

// here we map adresses to the proposals. In a later implementation would be contracts themselves! These contracts would (fed from a library)
// have the same functionality as this contract, therefore mimicking the "fractal nature of research"
	mapping (address => Proposal) public proposal;	

//this variable is used for the POWER token. POWER gets used up, but regerates over time after it has been used. The time of usage will be written into
// coolDown.
	uint public coolDown;

//Constructor
	function MetaCoin() {

		reputation[tx.origin]=1000;
		power[tx.origin]=reputation[tx.origin]/100;
		proposal[tx.origin].propname="notSet";
		proposal[tx.origin].data="notSet";
		proposal[tx.origin].Hash="notSet";
		proposal[tx.origin].status=Status.unset;
		proposal[tx.origin].voteCount=0;
		coolDown=now;
	}
// adds a fixed amount of REPUTATION tokens to the account. later it could be a variable (the value depending on the scientific achievements).
	function reward() public{
		reputation[msg.sender] += 100;
	}
// display the reputation. the reputation mapping (above) should provide a getter function, yet for better understanding (and it was giving trouble)
// we implement it here explicitly for now - same or similar is true for later getter functions.
	function getReputation() public view returns(int256) {
		return reputation[msg.sender];
	}

//POWER gets used up, but after a certain amount of time (here 30) after the coolDown-timestamp it is replenished according to the 
// REPUTATION of the user.
	function getPower() public view returns(int256) {
		if(now>coolDown+30){ // this function might to not work properly on a local blockchain as it depends on the block time. If nothing is mined...
		power[msg.sender]=reputation[msg.sender]/100;
		}
		return power[msg.sender];
	}
// POWER is used for different taks. Right now it is only used for submitting data, which costs 5 power.
	function usePower() public {
		power[msg.sender] -= 5;
		coolDown=now; // the timestamp is the block time
	}
// The submitted proposal data is written intp the Proposal struct. Additionally the status is set to consideration and the "mapping index"
// applicants[] (see above) is set.
	function sendData(string propname, string data, string Hash) public{
		proposal[msg.sender].propname = propname;
		proposal[msg.sender].Hash = Hash;
		proposal[msg.sender].data = data;
		proposal[msg.sender].status = Status.consideration;
		applicants.push(msg.sender);
				
	}
// getter for the proposal data including the variables that are not set by the user but the programm (as status)	
	function getData() public view returns(string, string, string, Status, int256, uint) {
		return (proposal[msg.sender].propname, proposal[msg.sender].data, proposal[msg.sender].Hash, proposal[msg.sender].status, proposal[msg.sender].voteCount, proposal[msg.sender].votesDone);
	}

// get the "proposal index" see above, for the looping logic in js
	function getApplicants() public view returns(address[]) {
			return applicants;
	}
// to display the user the own submitted proposal
	function getProposal(address adr) public view returns(string, string, string) {
			return (proposal[adr].propname, proposal[adr].data, proposal[adr].Hash);
	}

//Voting logic. It takes the vote (-1, 0, +1) and the adress of the vote.
	function Vote(int256 vote, address applicant) {
       Voter sender = voters[msg.sender];

//It is required that the voter has not voted for this specific proposal    	
		require (!voters[msg.sender].votedFor[applicant]);

// if the requirement is fulfilled then:
        sender.votedFor[applicant] = true; // set the vote for that specific proposal and voter true
		proposal[applicant].votesDone +=1; 
		proposal[applicant].voteCount += vote; //the votes getting sumed up for the total decision in the end.

		uint votesNeeded=2; // for testing purposes. It should be the list of acitve metamask accounts (or a fraction or similar), which currently cannot be retrieved.
		// https://github.com/MetaMask/metamask-extension/issues/1648
		

		if (proposal[applicant].votesDone == votesNeeded){ // in case of enough votes
// see what the total vote summation is and decide accordingly what the status of the proposal is.
			if(proposal[applicant].voteCount>0){
				 proposal[applicant].status = Status.funded; 
			}
			if(proposal[applicant].voteCount==0){
				 proposal[applicant].status = Status.revise; 
			}
			if(proposal[applicant].voteCount<0){
				 proposal[applicant].status = Status.burned; 
			}
//At a later stage	voters[msg.sender].votedFor[applicant] should be reset here as well, but this only makes sense if one user can do more
// than one proposal at the time, which will if the proposals are created not as a mapping but as a life contract.	
	  
    	}
	}

}
