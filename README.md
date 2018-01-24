# futurehack SciDApp Team

We have created a detailed [GitHub Wiki](https://github.com/SciDappSDG/futurehack/wiki) documentation of the project with futher background information.

<p align="center">
  <img width="260" height="300" src="https://github.com/SciDappSDG/futurehack/blob/master/EinApfelBaum.gif">
</p>

[Fractal Tree Simulation code here!](https://github.com/SciDappSDG/futurehack/blob/master/Fractal_Tree.py)


## Code Review

The DApp was written using truffle framework. The files to run the SciDapp are 

[index.html](https://github.com/SciDappSDG/futurehack/blob/master/app/index.html)

[app.js](https://github.com/SciDappSDG/futurehack/blob/master/app/javascripts/app.js)

[app.css](https://github.com/SciDappSDG/futurehack/blob/master/app/stylesheets/app.css) inside .../app/ and 

[MetaCoin.sol](https://github.com/SciDappSDG/futurehack/blob/master/contracts/MetaCoin.sol)    in ../contracts/


For testing the files we recommend to download and compile the [Truffle Webpack](http://truffleframework.com/tutorials/bundling-with-webpack) and follow the following workflow:

0) Install truffle framework, unpack webpack, install ganache as local blockchain.
1) Start ganache and the web lite server (npm run dev). Watch out that the truffle.js file of your truffle folder has the same port as ganache is listening to.
2) Copy Index.html, app.js, app.css and MetaCoin.sol in the corresponding folders (replace the files)
3) Compile and deploy the script using truffle compile and truffe deploy (--reset)
4) http://localhost:8080/ should display the website. To interact with the block chain have MetaMask running, and set it to the correct RPC (ganache on Port 8545 (confirm this with ganache))
5) For testing purposes create 3 Accounts
  (It works also with more accounts, not with less, as voting becomes meaningless and the voting will never "end")
6) Play around with it.

! If you switch between users/ MetaMask accounts in MetaMask press refresh on the browser!

## For explanation of the UI functionality (!) see: 

https://github.com/SciDappSDG/futurehack/blob/master/Functionality.pdf


## A flow diagram of the (later stage) smart contract logic can be found here:

https://github.com/SciDappSDG/futurehack/wiki/Flow-diagram-of-Sci%C4%90App-Smart-contracts 
The recursiveness has not yet been implemented. We have created the "seed" though. In the end this recursive structure (contract creates a contract) will lead to the structure of a Merkle Tree.


## A flow diagram of the token mechanics can be found here:

https://github.com/SciDappSDG/futurehack/wiki/Token-mechanics

Have fun playing!

## For questions, contact support at gotthold.flaeschner@bsse.ethz.ch
