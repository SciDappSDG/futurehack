# futurehack

The dApp was written using truffle framework. The files to run the SciDapp are index.html, app.js and MetaCoin.sol (and app.css for beauty). For testing the files we recommend to download and compile the truffle webpack and follow the following workflow:

0) Install truffle framework, unpack webpack, install ganache as local blockchain.
1) Start ganache and the web lite server (npm run dev). Watch out that the truffle.js file of your truffle folder has the same port as ganache is listening to.
2) Copy Index.html, app.js, app.css and MetaCoin.sol in the corresponding folders (replace the files)
3) Compile and deploy the scrit using truffle compile and truffe deploy (--reset)
4) http://localhost:8080/ should display the website. To interact with the block chain have MetaMask running, and set it to the correct RPC (ganache on Port 8545 (confirm this with ganache))
5) For testing purposes create 3 Accounts
  (It works also with more accounts, not with less, as voting becomes meaningles and the voting will never "end")
6) Play around with it.

For the functionality of the programm see: functionality.pdf , for the 


We have created a detailed Wikipedia documentation of the project: https://github.com/SciDappSDG/futurehack/wiki


A flow diagram of the smart contract logic can be found here: 
https://github.com/SciDappSDG/futurehack/wiki/Flow-diagram-of-Sci%C4%90App-Smart-contracts


A flow diagram of the token mechanics can be found here:
https://github.com/SciDappSDG/futurehack/wiki/Token-mechanics
