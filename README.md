# HyFi 🍣

https://wppenergy.io/. Feel free to read the code. More details coming soon.

## Deployed Contracts

Ropsten:
- `hyfi.finance` = 0x5600fdEFC3B7C97d32AcF25e9FFB26eCc2b5D727
- `master` = 0x1B94261b76CE938719276Edf631dAb10794cEC66

## Implementation

### HyFi Contract

- `name`: `hyfi.finance`
- `symbol`: `HyFi`
- `Presale Address`: used to mint initial tokens to a certain address. This presale address needs to be provided while deploying the contract (via constructor)

### Master Contract
The master contract is used to store the LP tokens staked by the user and distribute rewards accordingly. In order to mint and transfer HyFi tokens, the master contract should be owner of the HyFi contract

## Deployment
1. Deploy HyFi contract
    1. Set compiler version to 0.6.12+commit
    2. Presale Address: This would mint 10^25 tokens to the provided address. You can provide any valid address
    3. Obtain the address of the deployed contract

2. Deploy Master Contract
    1. Set:
        1. `_hyfi` = Contract address obtained from step 1.3
        2. `_hyfiPerBlock` = HyFi tokens created per block. Example: 100
        3. `_startBlock` = The block number when HyFi mining starts. Use any block number that should be mined in the near future
    2. Deploy the contract and obtain the address of the contract

3. Transfer Ownership of HyFi to Master contract
    1. The current owner of HyFi contract should call transferOwnership function of the HyFi contract with the address of the new owner i.e. Master contract. The address of the master contract was obtained from step 2.2

4. Add a new LP to the  pool of supported LP tokens
    1. The owner of the master contract should call “add” function with the following params:
        1. `_allocPoint` = The number of allocation points assigned to this pool. This is used to calculate HyFis to distribute to each pool per block
        2. `_lpToken` = Address of the LP contract
        3. `_withUpdate` = Boolean. Should be set to “false“ for most of the cases. If this is set to true then all the existing liquidity pools variables would be updated.  Be careful of gas spending!

## Testing
1. Follow step 1 and step 2 from the Deployment section
2. Mint some HyFi tokens for a user
    1. The owner of HyFi contract should call mint function with the desired address and amount
    2. Verify if the balance of the user is updated in HyFi contract
3. Follow Step 3 of the Deployment section
4. Create an LP token pair from uniswap
    1. https://app.uniswap.org/#/create/ETH
    2. Provide the address of HyFi contract
    3. Approve funds
    4. Create a pair
5. Obtain the address of LP contract deployed by UniSwap for us. This could be obtained via etherscan - look for ERC20 token for the user that created this LP pair
6. Add LP to the LP pool in the master contract. Follow step 4 from the “Deployment” section
7. Approve transfer of funds from LP contract to Master contract. This would be required if we want to deposit some LP tokens into the master contract in order to receive rewards periodically. 
    1. Call “approve” function in the LP contract with the amount that needs to be deposited into the master contract with the address of the master contract as the spender
8. Deposit LP tokens to the master contract
    1. Call the “deposit” function of the master contract
        1. `_pid` = index of the LP pool. Example: 0
        2. `_amount` = amount that needs to be deposited. Should be less/equal to the amount approved to master contract
9. The reward would be added periodically. The current rewards can get obtained by calling “pendingHyFi” function of the master contract
10. Withdraw 
    1. Call the “withdraw” function of the master contract
        1. `_pid` = index of the LP pool. Example: 0
        2. `_amount` = amount that needs to be withdrawn. 
    2. The reward (in terms of HyFi Tokens) would have been added to your address
    3. The withdrawn amount should be reflected back in the LP contract 

## TODO
1. The initial amount that needs to be minted to the presale address while deploying HyFi token contract
2. Per block reward and start block for reward distribution in the master contract


## Part-2: Swap Tokens
**[TODO]**

