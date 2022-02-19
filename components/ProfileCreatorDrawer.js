import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,

} from '@chakra-ui/react'
import {
    Stack,
    Box,
    FormLabel,
    FormHelperText,
    FormControl,
    Input,
    InputGroup,
    InputRightAddon,
    InputLeftAddon,
    Select,
    Textarea,
    Flex,
    Heading,
    Center,
    VStack,
    useToast
} from '@chakra-ui/react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { ethers } from "ethers";
import { addresses, abis } from '../contracts';

export default function ProfileCreatorDrawer({ isEnabled, signer, lensHubContract, walletAddress, chainId, web3provider, connectWallet }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = useRef()

    const [profileHandleValue, setProfileHandleValue] = useState('') // input value
    const [imageURIValue, setImageURIValue] = useState('https://ipfs.io/ipfs/bafkreicqwozpx36nx22scnrirfpfmdzt6fpiyw7zqx343lsvueda76cz5i') // input value

    const [isTxPending, setIsTxPending] = useState(false) // transaction status

    // toast for tx feedback
    const [toastMessage, setToastMessage] = useState(undefined);
    const toast = useToast();
    useEffect(() => {
        if (toastMessage) {
            const { title, body, status } = toastMessage;
            toast({
                title: `${title}`,
                description: `${body}`,
                status: `${status}`,
                position: 'top-right',
                duration: 9000,
                isClosable: true
            });
        }
    }, [toastMessage, toast]);

    async function createProfile() {
        // console.log(`profileHandleValue: ${profileHandleValue}`)
        // console.log(`imageURIValue: ${imageURIValue}`)

        if (walletAddress === "") {
            alert('Please connect your wallet.')
        }
        else if (chainId !== 80001) {
            alert('Please change network to Polygon Mumbai Testnet.')
        }
        else {
            const inputStruct = {
                to: walletAddress,
                handle: profileHandleValue.toLowerCase(),
                imageURI: imageURIValue,
                followModule: addresses.ZERO_ADDRESS,
                followModuleData: [],
                followNFTURI:
                    'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
            };
            // console.log(inputStruct)
            // console.log(signer)
            try { // call to contract post
                const mockProfileCreationProxy = new ethers.Contract(addresses.MockProfileCreationProxy, abis.MockProfileCreationProxy, web3provider);
                const tx = await mockProfileCreationProxy.connect(signer).proxyCreateProfile(inputStruct)
                setIsTxPending(true)
                const receipt = await tx.wait()
                console.log(receipt)
                const newProfileID = ethers.BigNumber.from(receipt?.logs[0]?.topics?.[3])?.toString()
                setIsTxPending(false)
                onClose() // close drawer
                connectWallet() // reload owned profile IDs
                const toastBody = newProfileID
                    ? `${profileHandleValue.toLowerCase()} - ID #${newProfileID}`
                    : ``
                setToastMessage(
                    {
                        status: 'success',
                        title: "Profile created",
                        body: toastBody
                    }
                )
            }
            catch (error) {
                // console.log(error)
                setToastMessage(
                    {
                        status: 'error',
                        title: "Transaction failed",
                        body: `The name ${profileHandleValue.toLowerCase()} may already exist.`
                    }
                )
            }
        }
    }

    function onOpenCreateProfile() {
        if (isEnabled) {
            onOpen()
        }
        else {
            alert('Please connect your wallet to a compatible network.')
        }
    }
    return (
        <>
            <Button
                leftIcon={<AddIcon />}
                bg='#e5ffbd'
                textColor='#00501e'
                _hover={{
                    backgroundColor: '#89e401'
                }}
                colorScheme='gray' variant='solid'
                borderColor='#00501e'
                onClick={() => onOpenCreateProfile()}>
                Create profile
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='bottom'
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <form
                    onSubmit={e => {
                        e.preventDefault();
                    }}>
                    <DrawerContent style={{ maxWidth: "720px" }} alignItems='stretch' m='auto'>
                        <DrawerCloseButton />

                        <DrawerHeader borderBottomWidth='1px'>
                            Create a new Lens profile
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Flex >
                                    <FormControl>
                                        <FormLabel htmlFor='profileHandle'>Name (handle)</FormLabel>
                                        <Input
                                            focusBorderColor='#00501e'
                                            autoComplete="off"
                                            isRequired={true}
                                            ref={firstField}
                                            id='username'
                                            placeholder='Please enter a user name'
                                            value={profileHandleValue}
                                            onChange={(e) => setProfileHandleValue(e.target.value)}
                                        />
                                        <FormHelperText>
                                            Must be one unique word, Latin lowercase alphabet characters, or digits from 0 to 9.<br />
                                            For instance : &lsquo;jackie&lsquo;, &lsquo;johndeere29&lsquo;, &lsquo;r0b0t&lsquo;.
                                        </FormHelperText>
                                    </FormControl>
                                </Flex>

                                <Box>
                                    <FormLabel htmlFor='imageURI'>Profile Picture (imageURI)</FormLabel>
                                    <Textarea id='imageURI'
                                        bg='whiteAlpha'
                                        rows='2'
                                        focusBorderColor='#00501e'
                                        type='text'
                                        placeholder='data:,Hello World'
                                        value={imageURIValue}
                                        onChange={(e) => setImageURIValue(e.target.value)} />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='0px'>
                            <Flex direction='row' justifyContent='center'>
                                <Button variant='outline' mr={3} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={createProfile}
                                    isLoading={isTxPending}
                                    bg='#e5ffbd'
                                    textColor='#00501e'
                                    _hover={{
                                        backgroundColor: '#89e401'
                                    }}
                                    colorScheme='gray' variant='solid'
                                    loadingText='Loading' spinnerPlacement='start'
                                >
                                    Create Profile
                                </Button>
                            </Flex>
                        </DrawerFooter>
                    </DrawerContent>
                </form>
            </Drawer>
        </>
    )
}
