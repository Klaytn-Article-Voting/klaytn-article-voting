const Web3 = require('web3')
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const abiToken = require('../artifacts/contracts/ATVToken.sol/ATVToken.json');
const abi = require('../artifacts/contracts/ArticleVoting.sol/ArticleVoting.json');

// for producting
const privateKeys = [
    process.env.ACCOUNT
]
let provider = new HDWalletProvider(
    privateKeys,
    `https://klaytn-baobab.blockpi.network/v1/rpc/public`,
    0,
    1
);
const web3 = new Web3(provider);

async function mint() {
    try {
        const contract = new web3.eth.Contract(
            abiToken.abi,
            "0xe117C1F93c0CfD06ffd7C4615eDF7Cf852109c6f",
        )
        // 0xB13332f8d4E81df0709d9Ffa15CB42D8dC0839c3
        // 0xf503bCfF9528F592A5b1644C0932BE10cE4991A9
        const tx = await contract.methods.mint("0xA84937C6F5f6ad83d885E977262d8d7A237D012A", "999999999999999999999999999");
        await tx.estimateGas({
            from: "0xA84937C6F5f6ad83d885E977262d8d7A237D012A"
        });
        await tx.send({
            from: '0xA84937C6F5f6ad83d885E977262d8d7A237D012A'
        })
        
    } catch (e) {
        console.log(e);
    }
}

async function checkBlance() {
    try {
        const contract = new web3.eth.Contract(
            abiToken.abi,
            "0xe117C1F93c0CfD06ffd7C4615eDF7Cf852109c6f",
        )
        const tx = await contract.methods.balanceOf("0xA84937C6F5f6ad83d885E977262d8d7A237D012A").call();
        console.log(tx);
    } catch (e) {
        console.log(e);
    }
}

async function getStatus() {
    try {
        const contract = new web3.eth.Contract(
            abi.abi,
            "0x953648A3dc9612cBBF503E416A9Afe3F8e43e299",
        )
        const tx = await contract.methods.imageId("1").call();
        console.log(tx);
    } catch (e) {
        console.log(e);
    }
}

async function approve() {
    try {
        const contract = new web3.eth.Contract(
            abiToken.abi,
            "0xe117C1F93c0CfD06ffd7C4615eDF7Cf852109c6f",
        )
        const tx = await contract.methods.approve("0x953648A3dc9612cBBF503E416A9Afe3F8e43e299", "999999999999999999999999999999");
        await tx.estimateGas({
            from: "0xA84937C6F5f6ad83d885E977262d8d7A237D012A",
        });
        await tx.send({
            from: '0xA84937C6F5f6ad83d885E977262d8d7A237D012A'
        })
    } catch (e) {
        console.log(e);
    }
}


async function updateTimeVoting() {
    try {
        const contract = new web3.eth.Contract(
            abi.abi,
            "0x953648A3dc9612cBBF503E416A9Afe3F8e43e299",
        )
        const tx = await contract.methods.updateTimeVoting("", "");
        await tx.estimateGas({
            from: "0xA84937C6F5f6ad83d885E977262d8d7A237D012A",
        });
        await tx.send({
            from: '0xA84937C6F5f6ad83d885E977262d8d7A237D012A'
        })
    } catch (e) {
        console.log(e);
    }
}

async function vote() {
    try {
        const contract = new web3.eth.Contract(
            abi.abi,
            "0x953648A3dc9612cBBF503E416A9Afe3F8e43e299",
        )
        const tx = await contract.methods.vote("100000000000000000", "1");
        await tx.estimateGas({
            from: "0xA84937C6F5f6ad83d885E977262d8d7A237D012A",
        });
        await tx.send({
            from: '0xA84937C6F5f6ad83d885E977262d8d7A237D012A'
        })
    } catch (e) {
        console.log(e);
    }
}

async function withdraw() {
    try {
        const contract = new web3.eth.Contract(
            abi.abi,
            "0x953648A3dc9612cBBF503E416A9Afe3F8e43e299",
        )
        const tx = await contract.methods.withdraw();
        await tx.estimateGas({
            from: "0xA84937C6F5f6ad83d885E977262d8d7A237D012A",
        });
        await tx.send({
            from: '0xA84937C6F5f6ad83d885E977262d8d7A237D012A'
        })
    } catch (e) {
        console.log(e);
    }
}

async function initData() {
    try {
        const contract = new web3.eth.Contract(
            abi.abi,
            "0x953648A3dc9612cBBF503E416A9Afe3F8e43e299",
        )
        const data = [
            {
                title: "For a More Creative Brain Follow These 5 Steps",
                written_by: "JAMES CLEAR",
                category: "CREATIVITY, PRODUCTIVITY",
                description: `https://jamesclear.com/five-step-creative-process`,
                amountVote: 0
            },
            {
                title: "The Proven Path to Doing Unique and Meaningful Work",
                written_by: "JAMES CLEAR",
                category: "CREATIVITY, LIFE LESSONS",
                description: `https://jamesclear.com/stay-on-the-bus`,
                amountVote: 0
            },
            {
                title: "Creativity Is a Process, Not an Event",
                written_by: "JAMES CLEAR",
                category: "CREATIVITY",
                description: `https://jamesclear.com/creative-thinking`,
                amountVote: 0
            },
            {
                title: "The Ultimate Productivity Hack is Saying No",
                written_by: "JAMES CLEAR",
                category: "DECISION MAKING, FOCUS, LIFE LESSONS",
                description: `https://jamesclear.com/saying-no`,
                amountVote: 0
            },
            {
                title: "Why Facts Don’t Change Our Minds",
                written_by: "JAMES CLEAR",
                category: "DECISION MAKING, LIFE LESSONS",
                description: `https://jamesclear.com/why-facts-dont-change-minds`,
                amountVote: 0
            },
            {
                title: "How Innovative Ideas Arise",
                written_by: "JAMES CLEAR",
                category: "DECISION MAKING, HABITS",
                description: `https://jamesclear.com/dont-start-from-scratch`,
                amountVote: 0
            },
        ]
        const owner = [
            "0x7e43f90bED8fD75BfF186Ae199c77F8dF55fD898",
            "0x895d54c0C99de41b31bc9B1e0b4a92Bc3190d256",
            "0xb28B3C557a3D0CE38CA0dDfe988ab355473C4130",
            "0xA84937C6F5f6ad83d885E977262d8d7A237D012A",
            "0x9C5232D1db9EAa4B87c8b8D1846A9bBC2A7AF91E",
            "0xE62F5E866C0687fCC248dA1AA80296BFEb677ca5",
        ]
        for (let i = 0; i < data.length; i++) {
            const tx = await contract.methods.initData(i, data[i], owner[i]);
            await tx.estimateGas({
                from: "0xA84937C6F5f6ad83d885E977262d8d7A237D012A",
            });
            await tx.send({
                from: '0xA84937C6F5f6ad83d885E977262d8d7A237D012A'
            })
        }
    } catch (e) {
        console.log(e);
    }
}

// mint()
// checkBlance()
// approve()
// vote()
// updateTimeVoting()
// withdraw()
getStatus()
// initData()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })