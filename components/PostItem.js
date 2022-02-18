import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip } from '@chakra-ui/react'
import PostItemTitle from './PostItemTitle'
import { resolveContentURI } from '../lib/URIhelper.js'

function PostItem({ postData }) {
    // console.log(`postData: ${JSON.stringify(postData)}`)
    const profileId = postData.profileId.id
    const profileHandle = postData.profileId.handle
    const owner = postData.profileId.owner
    let timestamp = postData.timestamp
    const name = profileHandle.concat('#', profileId)
    const contentURI = postData.contentURI

    // tests vars
    // const contentURI = 'data:,Hello World' // text/plain ok
    // const contentURI = 'data:text/plain,Hello World text/plain' // text/plain ok
    // const contentURI = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==' // text/plain ok
    // const contentURI = 'data:text/plain;base64,bGVucyBpbnB1dA==' // text/plain ok
    // const contentURI = "data:text/html,<span style='color:brown;font-weight:bold'>Lens post content</span>"
    // const contentURI = "data:text/html,<span style='color:rgb(171, 254, 44);font-weight:bold'>Lens post content</span>"
    // const contentURI = "https://ipfs.io/ipfs/bafybeie53rvcgggxflkqdmcpffsldpy62jfqrs22ryfyd3c3jvznou7zee"
    // const contentURI = "https://picsum.photos/500/200"

    const resolvedURI = resolveContentURI(contentURI)
    const mimeType = resolvedURI.mimeType
    const bodyDecoded = resolvedURI.bodyDecoded

    return (
        // <Flex>
        //     {/* {JSON.stringify(postData)} */}
        //     {postData.pubId} {' '} {postData.profileId.handle}
        // </Flex>
        <Flex direction='column' wrap='wrap' shadow='xl' borderWidth='1px' bg='white'>
            <PostItemTitle postData={postData} />
            <Flex className='postContent' px='5' py='5' justifyContent='center'>
                {
                    mimeType.startsWith('text/plain') || mimeType === ''
                        ? <Text fontSize='md'>{bodyDecoded}</Text>
                        : null
                }
                {
                    mimeType === 'text/html'
                        ? <Box dangerouslySetInnerHTML={{ __html: bodyDecoded }} fontSize='md'></Box>
                        : null
                }
                {
                    mimeType === 'image'
                        ? <>
                            <Image ml='-3' src={contentURI}
                                alt='Error : No compatible content to show'
                                maxHeight='300px'
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    // currentTarget.src = 'lens-protocol.png';
                                }} /></>
                        : null
                }
            </Flex >
        </Flex >
    )
}

export default PostItem
