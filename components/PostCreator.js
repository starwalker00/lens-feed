
import { useState, useEffect } from 'react'
import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip, Button } from '@chakra-ui/react'
import { ethers } from "ethers";
import { addresses, abis } from '../contracts';

function PostCreator() {
    const [web3provider, setWeb3Provider] = useState(null);
    const [walletAddress, setWalletAddress] = useState("");
    const [chainId, setChainId] = useState(null);
    const [signer, setSigner] = useState(null);
    const [lensHubContract, setLensHubContract] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                // window.location.reload();
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                setWeb3Provider(provider)
            })
            window.ethereum.on('accountsChanged', () => {
                // window.location.reload();
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                setWeb3Provider(provider)
            })
        }
    }, [])

    useEffect(() => {
        console.log(`useEffect`)
        console.log(`walletAddress: ${walletAddress}`)
    }, [walletAddress])

    useEffect(() => {
        console.log(`useEffect`)
        console.log(`chainId: ${JSON.stringify(chainId)}`)
    }, [chainId])

    useEffect(() => {
        console.log(`useEffect web3provider`)
        const connectOnSetProvider = async () => {
            await web3provider.send("eth_requestAccounts", [])
            const network = await web3provider.getNetwork()
            setChainId(network.chainId)
            const signer = web3provider.getSigner()
            setSigner(signer)
            const address = await signer.getAddress()
            setWalletAddress(address)
            const lensHub = new ethers.Contract(addresses.lensHubProxy, abis.lensHubProxy, web3provider)
            setLensHubContract(lensHub)
        }
        if (web3provider) {
            connectOnSetProvider().catch(console.error)
        }
    }, [web3provider])


    async function connectWallet() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setWeb3Provider(provider)
    }

    async function disconnectWallet() {
        setWalletAddress("")
        setSigner(null)
        setChainId(null)
        setLensHubContract(null)
    }

    async function post() {
        if (walletAddress === "") {
            alert('Please connect your wallet')
        }
        else if (chainId !== 80001) {
            alert('Change network to polygon mumbai')
        }
        else {
            const inputStruct = {
                profileId: 42,
                contentURI:
                    'https://ipfs.io/ipfs/bafybeie53rvcgggxflkqdmcpffsldpy62jfqrs22ryfyd3c3jvznou7zee',
                collectModule: addresses.emptyCollectModule,
                collectModuleData: [],
                referenceModule: addresses.ZERO_ADDRESS,
                referenceModuleData: [],
            }
            await lensHubContract.connect(signer).post(inputStruct);
        }
    }

    return (
        <>
            <Text>
                {walletAddress}
            </Text>
            {
                walletAddress === ""
                    ? <Button onClick={connectWallet}>Connect</Button>
                    : <Button onClick={disconnectWallet}>Disconnect</Button>
            }
            <Button onClick={post}>post</Button>
        </>
    )
}

export default PostCreator
