const Web3 = require('web3');
const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

class Web3WondersNFTGatherer {
    constructor(infuraUrl) {
        this.web3 = new Web3(infuraUrl);
        this.apiBase = 'https://api.opensea.io/api/v1';
    }

    async fetchNFTMetadata(contractAddress, tokenId) {
        const url = `${this.apiBase}/asset/${contractAddress}/${tokenId}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching NFT metadata:', error);
            return null;
        }
    }

    setupServer() {
        app.get('/nft/:contractAddress/:tokenId', async (req, res) => {
            const { contractAddress, tokenId } = req.params;
            const metadata = await this.fetchNFTMetadata(contractAddress, tokenId);
            res.json(metadata);
        });

        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    }
}

const gatherer = new Web3WondersNFTGatherer(process.env.INFURA_URL);
gatherer.setupServer();
