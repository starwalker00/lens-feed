
import { useState, useEffect } from 'react'
import { Box, useToast, Input, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip, Button, Spinner } from '@chakra-ui/react'
import { ethers } from "ethers";
import { addresses, abis } from '../contracts';
import HelpButtonAndModal from '../components/HelpButtonAndModal'
import PostItem from '../components/PostItem'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Textarea
} from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import ProfileCreatorDrawer from '../components/ProfileCreatorDrawer'

function PostCreator() {

    const [web3provider, setWeb3Provider] = useState(null);
    const [walletAddress, setWalletAddress] = useState("");
    const [chainId, setChainId] = useState(null);
    const [signer, setSigner] = useState(null);
    const [lensHubContract, setLensHubContract] = useState(null);
    const [ownedTokenIds, setOwnedTokenIds] = useState([]);

    const [profileIdValue, setProfileIdValue] = useState('') // input value
    const [contentURIValue, setContentURIValue] = useState('data:,Hello World') // input value

    // const [isMetamaskError, setIsMetamaskError] = useState(false) // transaction status
    const [isTxPending, setIsTxPending] = useState(false) // transaction status
    const [isLoadingOwnedIDs, setIsLoadingOwnedIDs] = useState(true) // contract queries

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

    useEffect(() => { // called on web3provider changed, on chainChanged and accountsChanged
        console.log(`useEffect web3provider`)
        const connectOnSetProvider = async () => {
            await web3provider.send("eth_requestAccounts", [])
            setIsLoadingOwnedIDs(true) // prevent showing not updated IDs after profile creation
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
            const MAX_TOKENID = 42
            try { // always caught
                for (var iter = 0; iter < MAX_TOKENID; iter++) {
                    let tokenId = await lensHub.tokenOfOwnerByIndex(address, iter)
                    ownedTokenIds.push(tokenId.toNumber().toString())
                }
            } catch (error) {
                console.log(iter) // reached every valid index
            }
            setIsLoadingOwnedIDs(false)
            setOwnedTokenIds(ownedTokenIds)
            if (ownedTokenIds.length > 0) { // display the first tokenId to the user in the form
                setProfileIdValue(ownedTokenIds[0])
            } else {
                setProfileIdValue('')
            }
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
        setProfileIdValue("")
    }

    async function post() {
        // console.log(`profileIdValue: ${ profileIdValue }`)
        // console.log(`contentURIValue: ${ contentURIValue }`)
        if (walletAddress === "") {
            alert('Please connect your wallet to a compatible network.')
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
            try { // call to contract post
                const tx = await lensHubContract.connect(signer).post(inputStruct)
                setIsTxPending(true)
                await tx.wait()
                setIsTxPending(false)
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

    // preview
    const previewPostInit = {
        profileId: {
            id: 0,
            owner: '0x0000000000000000000000000000000000000000',
            handle: 'preview',
            createdOn: Math.round(new Date().getTime() / 1000),
            pubCount: 0
        },
        timestamp: Math.round(new Date().getTime() / 1000),
        contentURI: contentURIValue
    }
    const [isPreviewVisible, setIsPreviewVisible] = useState(false)
    const [previewPost, setPreviewPost] = useState(previewPostInit)

    useEffect(() => { // called on every content URI change and re-renders a PostItem, possible performance issues
        if (isPreviewVisible) {
            const timer = setTimeout(() => { // avoid bouncing data fields 
                setPreviewPost({
                    ...previewPost,
                    contentURI: contentURIValue,
                    timestamp: Math.round(new Date().getTime() / 1000)
                });
            }, 500)
            return () => clearTimeout(timer)
        }
        if (!isPreviewVisible) {
            setPreviewPost(previewPostInit)
        }
    }, [isPreviewVisible, contentURIValue])

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
                    <Flex direction='column' alignItems='center'>
                        <Box pb='2'>
                            {
                                chainId === 80001 ?
                                    ownedTokenIds.length > 0
                                        ? isLoadingOwnedIDs ? <HStack><Spinner size='sm' /><Text>Loading IDs</Text></HStack> : <Flex><Text>Owned profile ID :{' '}{ownedTokenIds.join(', ')}.</Text></Flex>
                                        : walletAddress === ""
                                            ? <Text></Text>
                                            : isLoadingOwnedIDs ? <HStack><Spinner size='sm' /><Text>Loading IDs</Text></HStack> : <Text>You do not own a Lens profile on this network. Create one before posting.</Text>
                                    : chainId ? <Text>Please connect to Polygon Mumbai Testnet.</Text> : <Text></Text>
                            }
                        </Box>
                        <ProfileCreatorDrawer
                            walletAddress={walletAddress}
                            chainId={chainId}
                            lensHubContract={lensHubContract}
                            signer={signer}
                            web3provider={web3provider}
                            isEnabled={chainId === 80001 && walletAddress !== "" && lensHubContract}
                            connectWallet={connectWallet} />
                    </Flex>

                </Flex>

                <Flex direction='column' className='post-form' bg='#abfe2c' color='#00501e' p='40px' pb='10px' borderRadius='12px'>
                    <Flex mt='-35px' mr='-35px' alignItems='baseline'>
                        <Heading as='h6' size='md' alignSelf='center'>Publish a post : </Heading>
                        <Spacer />
                        <HelpButtonAndModal size={'md'} />
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

                            <Flex direction='column' width='100%' mt='3'>
                                <Flex direction='row' width='100%' >
                                    <FormLabel htmlFor='contentURI'>
                                        Content URI
                                        <HelpButtonAndModal size={'xs'} />
                                    </FormLabel>
                                    <Spacer />
                                    <IconButton
                                        onClick={() => setContentURIValue('data:,Hello World')}
                                        colorScheme='yellow'
                                        aria-label='Help'
                                        size='xs'
                                        ml='2'
                                        icon={<RepeatIcon />}
                                    />
                                </Flex>
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
                        <Flex direction='row'>
                            <Spacer />
                            <Button m='3'
                                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                                bg='#e5ffbd'
                                textColor='#00501e'
                                _hover={{
                                    backgroundColor: '#89e401'
                                }}
                                colorScheme='gray' variant='solid'
                            >
                                {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
                            </Button>
                            <Spacer />
                            <Button m='3'
                                type="submit"
                                onClick={post}
                                isLoading={isTxPending}
                                bg='#e5ffbd'
                                textColor='#00501e'
                                _hover={{
                                    backgroundColor: '#89e401'
                                }}
                                colorScheme='gray' variant='solid'
                                loadingText='Loading' spinnerPlacement='start'
                                alignSelf='flex-end'
                            >
                                Post
                            </Button>
                        </Flex>
                    </form>
                </Flex>
                {
                    isPreviewVisible &&
                    <PostItem postData={previewPost} />
                }
            </VStack>
        </>
    )
}

export default PostCreator
