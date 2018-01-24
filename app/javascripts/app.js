// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

var MetaCoin = contract(metacoin_artifacts);

var accounts;
var account;

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

  sendData: function() {
    var self = this;

    var name = document.getElementById("propname").value;
    var data = document.getElementById("data").value;
    var hash = document.getElementById("hash").value;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendData(name, data, hash, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshReputation();
      self.refreshPower();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending proposal data; see log.");
    });
  },

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


  usePower: function() {
    var self = this;
    
    this.setStatus("Initiating reward... (please wait)");

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

  refreshData: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getData.call({from: account});
    }).then(function(data) {
      console.log(data);
      var proposal_element = document.getElementById("submittedProposal");
      proposal_element.innerHTML = data[0];
      var data_element = document.getElementById("submittedData");
      data_element.innerHTML = data[1];
      var hash_element = document.getElementById("submittedHash");
      hash_element.innerHTML = data[2];
      console.log(data[4].valueOf());
      var status_element = document.getElementById("propstatus");
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
  
  getVotingData: function() {
    var meta;
    var dataStor = [];
    var visible = [];
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return (meta.getApplicants.call({from: account}));
    }).then(function(Applicants) {   
      for (let s of Applicants) {
        if(s != account){
          meta.getProposal.call(s,{from: account}).then(function(PropsData){dataStor.push(PropsData)}); 
          visible.push(s);
        }
      }
      setTimeout(function (r){console.log(dataStor); 
        window.data=dataStor;
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

  Vote: function(vote, adr) {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      console.log(vote);
      console.log(adr);
      return meta.Vote(vote, adr, {from: account});
    }).then(function() {
      self.setStatus("Rewarding process complete!");
      self.refreshReputation();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error topping up your reputation; see log.");
    });
  },


  sendCoin: function() {
    var self = this;
    
    this.setStatus("Initiating reward... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin({from: account});
    }).then(function() {
      self.setStatus("Rewarding process complete!");
      self.refreshReputation();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error topping up your reputation; see log.");
    });
  }
};

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
