import { Box, Center, Flex, Image, Text, WrapItem, VStack, Spacer, Button, Link } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import JSONPretty from 'react-json-pretty';

function PostItemRawdataModal({ post }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // let profileId = profile[0];
    // let handle = profile[4];
    return (
        <>
            <Button
                size='xs'
                variant='solid'
                onClick={onOpen}>
                Raw Data
            </Button>
            <Modal size='xl3' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        title
                    </ModalHeader>
                    <ModalCloseButton colorScheme='teal' variant='solid' />
                    <ModalBody>
                        <Text as='div' overflow='auto'>
                            <JSONPretty id="json-pretty" data={JSON.stringify(post)}></JSONPretty>
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='teal' variant='solid' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostItemRawdataModal
