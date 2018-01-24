// Import the page's CSS.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// As we started with the webpack from truffle the file is still called "meta-coin". We kept that name to avoid confusion during
// the version tracking.

import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

//---------------------------------------------------------------------------------
//Try some IPFS action. Does not work yet, will soon ;0 - skip to the end of IPFS-action
//---------------------------------------------------------------------------------
/* const Block = require('ipfs-block')

var ipfs = IPFS()

function store () {
  var toStore = document.getElementById('source').value
  ipfs.add(Buffer.from(toStore), function (err, res) {
    if (err || !res) {
      return console.error('ipfs add error', err, res)
    }

    res.forEach(function (file) {
      if (file && file.hash) {
        console.log('successfully stored', file.hash)
        display(file.hash)
      }
    })
  })
}

function display (hash) {
  // buffer: true results in the returned result being a buffer rather than a stream
  ipfs.cat(hash, {buffer: true}, function (err, res) {
    if (err || !res) {
      return console.error('ipfs cat error', err, res)
    }

    document.getElementById('hash').innerText = hash
    document.getElementById('content').innerText = res.toString()
  })
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('store').onclick = store
}) */
//---------------------------------------------------------------------------------
// End of IPFS action
//---------------------------------------------------------------------------------

var MetaCoin = contract(metacoin_artifacts);

var accounts;
var account;

// App is wrapping now all functionalities, the functions up to "setStatus" are as in truffles webpack.
window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshReputation();
      self.refreshPower();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },
//---------------------------------------------------------------------------------
//Now our SciDapp Logic starts.
//---------------------------------------------------------------------------------

//Allows to submit the Proposal name, the data (meaning the tags for the project i.e. "awsome SciDapp") and the IPFS hash value.
//In a later implementation the hash would be handed over via above (not working) IPFS implementation, so that the Proposal can be written
// and submitted via one Interface.
//The logic can later be extended and used for submits of scientific data etc.

  sendData: function() {
    var self = this;

//Read the three parameters out of the html code snippets of the correct ID.    
    var name = document.getElementById("propname").value;
    var data = document.getElementById("data").value;
    var hash = document.getElementById("hash").value;

    //get the instance of the deployed contract
    var meta;    
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
//now Hand over the Data to the code running on the blockchain.      
      return meta.sendData(name, data, hash, {from: account});
    }).then(function() {
      self.setStatus("Proposal submitted!");

  //the submission of data costs POWER - one of our two tokens - which will be updated.
      self.refreshPower();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending proposal data; see log.");
    });
  },

  //This function refreshes the display of REPUTATION - our POWER generating token -
  refreshReputation: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getReputation.call({from: account});
    }).then(function(value) {
      var reputation_element = document.getElementById("reputation");
      reputation_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting reputation balance; see log.");
    });
  },

//This function refreshes the display of POWER. POWER will be used for doing submits and payment for services (i.e. "research that for me")
  refreshPower: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getPower.call({from: account});
    }).then(function(value) {
      console.log("refresh");
      var balance_element = document.getElementById("power");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting power balance; see log.");
    });
  },  

//This function can later on be used at different instances (see above), right now it is only called when a submit is done. For the moment
// one submit costs 5 POWER (as specified in solidity code), for later implementation it would be a variable
  usePower: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.usePower({from: account});
    }).then(function() {
      self.setStatus("Rewarding process complete!");
      self.refreshPower();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error using your power; see log.");
    });
  }, 

  //Refreshes the display of what the user has submitted, a status will be displayed (under review, accepted, funded, burned)
  refreshData: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getData.call({from: account});
    }).then(function(data) {
      console.log(data);
      //Display the submitted data.
      var proposal_element = document.getElementById("submittedProposal");
      proposal_element.innerHTML = data[0];
      var data_element = document.getElementById("submittedData");
      data_element.innerHTML = data[1];
      var hash_element = document.getElementById("submittedHash");
      hash_element.innerHTML = data[2];
      console.log(data[4].valueOf());
      var status_element = document.getElementById("propstatus");

      //Display the status. It will be displayed as colored dots. See app.css
      // unset = black
      // consideration = yellow
      // revise = orange
      // burned = rot
      // funded = green

      if (data[3]==0){
        status_element.innerHTML = '<div id="unset"></div>'; }
      else if (data[3]==1){
        status_element.innerHTML = '<div id="consideration"></div>'; }
      else if (data[3]==2){
        status_element.innerHTML = '<div id="revise"></div>'; }
      else if (data[3]==3){
        status_element.innerHTML = '<div id="burned"></div>'; }        
      else if (data[3]==4){
        status_element.innerHTML = '<div id="funded"></div>'; }              
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting proposal data; see log.");
    });
  },
  
// Displays all the proposals that do not come from the user.
  getVotingData: function() {
    this.setStatus("Fetching the data... (please wait)");
    var meta;
    var dataStor = [];
    var visible = [];
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
// this getApplicants function returns all(!) the porposals. The filter logic is better be done in Js than on the blockchain.    
      return (meta.getApplicants.call({from: account}));
    }).then(function(Applicants) {  
// now we filter. every adresses of accounts that made a proposal, that is not equal to the current account are saved into the local variable s       
      for (let s of Applicants) {
        if(s != account){
// not we call all the specifics of the proposals using the local variable. All this is done in a loop, as solidity cannot export dynamic file types          
          meta.getProposal.call(s,{from: account}).then(function(PropsData){dataStor.push(PropsData)}); 
          visible.push(s);
        }
      }
// now we wait 4s, that all the data is stored into dataStor. It is a messy solution, that in a later stage should be rather implemented via
// an event listener.       
      setTimeout(function (r){console.log(dataStor); 
        window.data=dataStor;

// The proposals are getting displayed together with buttons for the vote. At a later stage this should be done via a loop, that loops over 
// the amount of proposals and it should include some filtering according to the users reputation and the tags of the proposal.
// For the vote we simply send -1, 0 or +1 as a value to the voting function together with the according adress of the proposal.        
       if(visible.length>=1){ 
         console.log(visible);
      document.querySelector('.Vote').innerHTML = "Proposal: " + dataStor[0][0] +", " 
      + "Tags: " + dataStor[0][1] + ",  " + "Hash: " + dataStor[0][2] + "  _______  "+ "<button id=\"vote\" onclick=\"App.Vote(-1, '"+visible[0]+"' )\">Reject</button>"
      + "<button id=\"vote\" onclick=\"App.Vote(0, '"+visible[0]+"' )\">Revise</button>" + "<button id=\"vote\" onclick=\"App.Vote(1, '"+visible[0]+"' )\">Accept</button>"; 
       }

       if(visible.length>=2){ 
        document.querySelector('.Vote2').innerHTML = "Proposal: " + dataStor[1][0] +",  " 
        + "Tags: " + dataStor[1][1] +",  " + "Hash: " + dataStor[1][2] + "  _______  "+ "<button id=\"vote\" onclick=\"App.Vote(-1, '"+visible[1]+"' )\">Reject</button>"
        + "<button id=\"vote\" onclick=\"App.Vote(0, '"+visible[1]+"' )\">Revise</button>" + "<button id=\"vote\" onclick=\"App.Vote(1, '"+visible[1]+"' )\">Accept</button>"; 
         }

         if(visible.length>=3){ 
          document.querySelector('.Vote3').innerHTML = "Proposal: " + dataStor[2][0] +",  " 
          + "Tags: " + dataStor[2][1] +",  " + "Hash: " + dataStor[2][2] + "  _______  "+ "<button id=\"vote\" onclick=\"App.Vote(-1, '"+visible[2]+"' )\">Reject</button>"
          + "<button id=\"vote\" onclick=\"App.Vote(0, '"+visible[2]+"' )\">Revise</button>" + "<button id=\"vote\" onclick=\"App.Vote(1, '"+visible[2]+"' )\">Accept</button>";
           }     
      }, 4000);
    }); 
  },   
// the function vote is being called via "onclick" inside the getVotingData, see above. 
  Vote: function(vote, adr) {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      console.log(vote);
      console.log(adr);
      return meta.Vote(vote, adr, {from: account});
    }).then(function() {
      self.setStatus("Voting done!");
      self.refreshReputation();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Voting error; see log.");
    });
  },

// This function is displayed here for testing purposes. It normally would be triggered via a vote on for instance a 
// completed project to award the scientist. It would award with the primary, not tradable token REPUTATION.
  reward: function() {
    var self = this;
    
    this.setStatus("Initiating reward... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.reward({from: account});
    }).then(function() {
      self.setStatus("Rewarding process complete!");
      self.refreshReputation();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error topping up your reputation; see log.");
    });
  }
};

//---------------------------------------------------------------------------------
//End of our SciDapp Logic.
//---------------------------------------------------------------------------------



window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
