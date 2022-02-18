import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Button, Container, Stack, Tooltip } from '@chakra-ui/react'
import { QuestionOutlineIcon, CopyIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Heading,
  Input
} from '@chakra-ui/react'
import { useClipboard } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
export default function HelpButtonAndModal() {
  const stringExamples = [
    'data:,Hello World',
    'data:text/plain;base64,bGVucyBpbnB1dA==',
    "data:text/html,<span style='color:teal;font-weight:bold'>Lens post content</span>"
  ]
  const imageExamples = [
    'https://ipfs.io/ipfs/bafybeihv5fg7l5e5rsxw2fkxs3hetvzt4cpuf3ku3abhpnij74czaernt4',
    'https://picsum.photos/id/664/500/200'
  ]

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('init')

  return (
    <>
      <IconButton
        onClick={onOpen}
        colorScheme='yellow'
        aria-label='Help'
        icon={<QuestionOutlineIcon />}
      />
      <Modal size='xl2' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Help</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading as='h6' mb='4' size='md'>Posting to Lens Protocol : </Heading>
            <OrderedList my='2' spacing='2' >
              <ListItem>Connect your browser wallet to Polygon Mumbai Testnet</ListItem>
              <ListItem>Enter the profileId of a profile you own</ListItem>
              <ListItem>Enter a content URI</ListItem>
              <ListItem>Click the Post button</ListItem>
            </OrderedList>
            <Text mt='3' fontSize='sm'>
              You must own the profileId you are trying to post with. This front-end does not provide a way to create a profile.
            </Text>
            <Heading mt='10' mb='4' as='h6' size='md'>Supported front-end contentURI : </Heading>
            <Text fontSize='md'>You can copy one of the following examples into the contentURI input box to post them.</Text>
            <List>
              <ListItem my='3'>Text in the following format :</ListItem>
              <List>
                {
                  stringExamples.map((val, index) => <ListExample value={val} key={index} />)
                }
              </List>
              <ListItem my='3'>Images uploaded to the web :</ListItem>
              <List>
                {
                  imageExamples.map((val, index) => <ListExample value={val} key={index} />)
                }
              </List>
            </List>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}


function ListExample({ value }) {
  return (
    <ListItem>
      <Flex mb={2} alignItems='center'>
        <ListIcon as={ChevronRightIcon} color='green.500' />
        <Input value={value} isReadOnly />
        <IconButton
          icon={<CopyIcon />}
          onClick={() => { navigator.clipboard.writeText(value) }}
          ml={2}>
        </IconButton>
      </Flex>
    </ListItem>
  )
}
