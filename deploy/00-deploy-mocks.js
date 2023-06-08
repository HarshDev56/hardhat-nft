const { network, ethers } = require("hardhat")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is premium. It cost 0.25 for every request
const GAS_PRICE_LINK = 1e9 // 1000000000 // 0.000000001 LINK per gas // link per gas. calculated value based on the gas price of the chain .

// Chainlink Nodes pay the gas fees to give us randomness & do external execution
// So they price of requests change based on the price of gas .

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const { DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config")
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })

        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
