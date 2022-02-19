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
    VStack
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

    const [isAlertOpen, setIsAlertOpen] = useState(false) // alert dialog
    const onAlertClose = () => setIsAlertOpen(false) // alert dialog

    async function createProfile() {
        console.log(`profileHandleValue: ${profileHandleValue}`)
        console.log(`imageURIValue: ${imageURIValue}`)

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
            console.log(inputStruct)
            console.log(signer)
            try { // call to contract post
                const mockProfileCreationProxy = new ethers.Contract(addresses.MockProfileCreationProxy, abis.MockProfileCreationProxy, web3provider);
                const tx = await mockProfileCreationProxy.connect(signer).proxyCreateProfile(inputStruct)
                setIsTxPending(true)
                await tx.wait()
                setIsTxPending(false)
                onClose()
                connectWallet()
                setIsAlertOpen(true)
                // alert('Profile Created.')
            }
            catch (error) {
                console.log(error)
                // if (profileIdValue) {
                //     setToastMessage(
                //         {
                //             title: "Transaction failed",
                //             body: `Make sure you own profileId number ${profileIdValue}`
                //         }
                //     )
                // } else {
                //     setToastMessage(
                //         {
                //             title: "Transaction failed",
                //             body: `Make sure you entered a profileId`
                //         }
                //     )
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
                // border='1px'
                borderColor='#00501e'
                onClick={() => onOpenCreateProfile()}>
                Create user
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='bottom'
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <form style={{ width: "100%" }}
                    onSubmit={e => {
                        e.preventDefault();
                    }}>
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            Create a new Lens profile
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormControl>
                                        <FormLabel htmlFor='profileHandle'>Name (handle)</FormLabel>
                                        <Input
                                            autocomplete="off"
                                            isRequired={true}
                                            ref={firstField}
                                            id='username'
                                            placeholder='Please enter a user name'
                                            value={profileHandleValue}
                                            onChange={(e) => setProfileHandleValue(e.target.value)}
                                        />
                                        <FormHelperText>
                                            Must be one unique word, Latin lowercase alphabet characters, or digits from 0 to 9.<br />
                                            For instance : 'jackie', 'johndeere29', 'r0b0t'.
                                        </FormHelperText>
                                    </FormControl>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='imageURI'>Profile Picture (imageURI)</FormLabel>
                                    <Textarea id='imageURI'
                                        bg='whiteAlpha'
                                        rows='1'
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

            <AlertDialog
                isOpen={isAlertOpen}
                // isOpen={true}
                onClose={onAlertClose}
                status='success'
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogBody>
                            <VStack direction='column' alignItems='center' p='2' spacing='24px'>
                                <Heading>Profile created</Heading>
                                <Button
                                    onClick={onAlertClose}
                                    bg='#e5ffbd'
                                    textColor='#00501e'
                                    _hover={{
                                        backgroundColor: '#89e401'
                                    }}
                                    colorScheme='gray' variant='solid'
                                >
                                    Ok
                                </Button>
                            </VStack>
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </>
    )
}
