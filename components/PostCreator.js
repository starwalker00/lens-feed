
import { useState, useEffect } from 'react'
import { Box, Input, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip, Button } from '@chakra-ui/react'
import { ethers } from "ethers";
import { addresses, abis } from '../contracts';

function PostCreator() {
    const [web3provider, setWeb3Provider] = useState(null);
    const [walletAddress, setWalletAddress] = useState("");
    const [chainId, setChainId] = useState(null);
    const [signer, setSigner] = useState(null);
    const [lensHubContract, setLensHubContract] = useState(null);

    const [profileIdValue, setProfileIdValue] = useState('') // input value
    const [contentURIValue, setContentURIValue] = useState('') // input value

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                setWeb3Provider(provider)
            })
            window.ethereum.on('accountsChanged', () => {
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
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            setWeb3Provider(provider)
        }
        else {
            alert('No browser wallet found.')
        }
    }

    async function disconnectWallet() {
        setWalletAddress("")
        setSigner(null)
        setChainId(null)
        setLensHubContract(null)
    }

    async function post() {
        // console.log(`profileIdValue: ${profileIdValue}`)
        // console.log(`contentURIValue: ${contentURIValue}`)
        if (walletAddress === "") {
            alert('Please connect your wallet.')
        }
        else if (chainId !== 80001) {
            alert('Please change network to Polygon Mumbai Testnet.')
        }
        else {
            const inputStruct = {
                profileId: profileIdValue,
                contentURI: contentURIValue,
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
            <Box>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                    }}>
                    <Flex
                        wrap='wrap'
                        justifyContent='space-evenly'
                        alignItems='center'
                        boxShadow='0px 0px 5px 0px #DA70D6'>
                        <Input
                            bg='whiteAlpha'
                            width='10%'
                            letterSpacing='.1rem'
                            value={profileIdValue}
                            onChange={(e) => setProfileIdValue(e.target.value)}
                            placeholder="id"
                        />
                        <Input
                            bg='whiteAlpha'
                            width='80%'
                            letterSpacing='.1rem'
                            value={contentURIValue}
                            onChange={(e) => setContentURIValue(e.target.value)}
                            placeholder="contentURI"
                        />
                        <Button m='3'
                            type="submit"
                            onClick={post}
                            colorScheme='teal' variant='solid'
                            // isLoading={isSearching}
                            loadingText='Loading' spinnerPlacement='start'
                        >
                            Post
                        </Button>
                    </Flex>
                </form>
            </Box>
        </>
    )
}

export default PostCreator
