
import { useState, useEffect } from 'react'
import { Box, useToast, Input, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip, Button } from '@chakra-ui/react'
import { ethers } from "ethers";
import { addresses, abis } from '../contracts';
import HelpButtonAndModal from '../components/HelpButtonAndModal'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Textarea
} from '@chakra-ui/react'

function PostCreator() {
    const [web3provider, setWeb3Provider] = useState(null);
    const [walletAddress, setWalletAddress] = useState("");
    const [chainId, setChainId] = useState(null);
    const [signer, setSigner] = useState(null);
    const [lensHubContract, setLensHubContract] = useState(null);
    const [ownedTokenIds, setOwnedTokenIds] = useState([]);

    const [profileIdValue, setProfileIdValue] = useState('') // input value
    const [contentURIValue, setContentURIValue] = useState('') // input value

    // const [isMetamaskError, setIsMetamaskError] = useState(false) // transaction status
    // const [isTxPending, setIsTxPending] = useState(false) // transaction status

    // toast for tx feedback
    const [toastMessage, setToastMessage] = useState(undefined);
    const toast = useToast();
    useEffect(() => {
        if (toastMessage) {
            const { title, body } = toastMessage;
            toast({
                title: `${title}`,
                description: `${body}`,
                status: 'error',
                position: 'top-right',
                duration: 9000,
                isClosable: true
            });
        }
    }, [toastMessage, toast]);

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
        // console.log(`useEffect`)
        console.log(`walletAddress: ${walletAddress}`)
    }, [walletAddress])

    useEffect(() => {
        // console.log(`useEffect`)
        // console.log(`chainId: ${JSON.stringify(chainId)}`)
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

            // get ownedTokenIds by connected address
            let ownedTokenIds = []
            const MAX_TOKENID = 10
            try {
                for (var iter = 0; iter < MAX_TOKENID; iter++) {
                    let tokenId = await lensHub.tokenOfOwnerByIndex(address, iter)
                    ownedTokenIds.push(tokenId.toNumber().toString())
                }
            } catch (error) {
                console.log(iter) // reached every valid index
            }
            setOwnedTokenIds(ownedTokenIds)
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
        setOwnedTokenIds([])
    }

    async function post() {
        // console.log(`profileIdValue: ${ profileIdValue }`)
        // console.log(`contentURIValue: ${ contentURIValue }`)
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
            try {
                await lensHubContract.connect(signer).post(inputStruct)
            }
            catch (error) {
                // console.log(error)
                if (profileIdValue) {
                    setToastMessage(
                        {
                            title: "Transaction failed",
                            body: `Make sure you own profileId number ${profileIdValue}`
                        }
                    )
                } else {
                    setToastMessage(
                        {
                            title: "Transaction failed",
                            body: `Make sure you entered a profileId`
                        }
                    )
                }
            }
        }
    }

    return (
        <>
            <VStack alignItems='stretch'>
                <Flex className='wallet-handler' bg='#e5ffbd' direction='column' color='#00501e' p='10px' pb='10px' borderRadius='12px' >
                    <Box>
                        {
                            walletAddress === ""
                                ? <Button onClick={connectWallet}>Connect Wallet</Button>
                                : <Button onClick={disconnectWallet}>Disconnect</Button>
                        }
                    </Box>
                    <Box p='2'>
                        {
                            walletAddress === ""
                                ? <Text>No Wallet Connected</Text>
                                : <Text>{walletAddress}</Text>
                        }
                    </Box>
                    <Box>
                        {
                            chainId === 80001 ?
                                ownedTokenIds.length > 0
                                    ? <Text>Owned profile ID :{' '}
                                        {
                                            ownedTokenIds.map((tokenId, index) => (
                                                index !== ownedTokenIds.length - 1
                                                    ? tokenId.concat(', ')
                                                    : tokenId.concat('.')
                                            ))
                                        }
                                    </Text>
                                    : walletAddress === "" ? <Text></Text> : <Text>You do not own a Lens profile on this network. Create one before posting.</Text>
                                : chainId ? <Text>Please connect to Polygon Mumbai Testnet.</Text> : <Text></Text>
                        }
                    </Box>
                </Flex>

                <Flex direction='column' className='post-form' bg='#abfe2c' color='#00501e' p='40px' pb='10px' borderRadius='12px'>
                    <Flex mt='-35px' mr='-35px' alignSelf='flex-end'>
                        <HelpButtonAndModal />
                    </Flex>
                    <form style={{ width: "100%" }}
                        onSubmit={e => {
                            e.preventDefault();
                        }}>
                        <FormControl>
                            <Flex direction='row' width='100%' justifyContent='center' alignItems='center'>
                                <FormLabel htmlFor='profileId'>Profile ID</FormLabel>
                                <Input
                                    bg='whiteAlpha'
                                    focusBorderColor='#00501e'
                                    textAlign='center'
                                    id='profileId'
                                    type='number'
                                    style={{ maxWidth: "120px" }}
                                    mr='10px'
                                    width='auto'
                                    placeholder='1'
                                    value={profileIdValue}
                                    onChange={(e) => setProfileIdValue(e.target.value)} />
                            </Flex>
                            <FormHelperText>You must own the profile to post with it.</FormHelperText>
                            <Flex direction='column' width='100%' >
                                <FormLabel mt='5' htmlFor='contentURI'>Content URI</FormLabel>
                                <Textarea id='contentURI'
                                    bg='whiteAlpha'
                                    rows='1'
                                    focusBorderColor='#00501e'
                                    type='text'
                                    placeholder='data:,Hello World'
                                    value={contentURIValue}
                                    onChange={(e) => setContentURIValue(e.target.value)} />
                            </Flex>
                        </FormControl>
                        <Button m='3'
                            type="submit"
                            onClick={post}
                            bg='#e5ffbd'
                            textColor='#00501e'
                            _hover={{
                                backgroundColor: '#89e401'
                            }}
                            colorScheme='gray' variant='solid'
                            // isLoading={isSearching}
                            loadingText='Loading' spinnerPlacement='start'>
                            Post
                        </Button>
                    </form>
                </Flex>
            </VStack>
        </>
    )
}

export default PostCreator
