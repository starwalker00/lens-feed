import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip } from '@chakra-ui/react'
import ReactTimeAgo from 'react-time-ago'
import PostItemRawdataModal from './PostItemRawdataModal'
import parseDataURL from 'data-urls'
import { labelToName, decode } from 'whatwg-encoding'
import DOMPurify from 'isomorphic-dompurify'

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

    function resolveContentURI(contentURI) {
        const breakingReturnValue = {
            mimeType: 'text/plain',
            bodyDecoded: 'Error : No compatible content to show'
        }
        try { // try text/plain decoding
            // console.log('text/plain decoding')
            const dataURL = parseDataURL(contentURI)
            const mimeType = dataURL.mimeType.toString()
            if (mimeType.startsWith('text/plain')) {
                const encodingName = labelToName(dataURL.mimeType.parameters.get("charset") || "utf-8")
                const bodyDecoded = decode(dataURL.body, encodingName)
                return { mimeType: mimeType, bodyDecoded: bodyDecoded }
            }
        }
        catch (error) {
            // console.log('could not parse string')
            // console.log(error)
        }
        try { // try text/html decoding
            // console.log('text/html decoding')
            let dataURL = parseDataURL(contentURI)
            let mimeType = dataURL.mimeType.toString()
            if (mimeType === 'text/html') {
                const encodingName = labelToName(dataURL.mimeType.parameters.get("charset") || "utf-8")
                const bodyDecoded = decode(dataURL.body, encodingName)
                return { mimeType: mimeType, bodyDecoded: DOMPurify.sanitize(bodyDecoded) }
            }
        }
        catch (error) {
            // console.log('could not parse string')
            // console.log(error)
        }
        try { // try image as link (frequent use case)
            // console.log('mage as link decoding')
            if (contentURI.toLowerCase().startsWith('https://')) {
                return { mimeType: 'image', bodyDecoded: contentURI }
            }
        }
        catch (error) {
            // console.log('could not parse string')
            // console.log(error)
        }
        //if nothing matched :
        return breakingReturnValue
    }
    const resolvedURI = resolveContentURI(contentURI)
    const mimeType = resolvedURI.mimeType
    const bodyDecoded = resolvedURI.bodyDecoded

    return (
        // <Flex>
        //     {/* {JSON.stringify(postData)} */}
        //     {postData.pubId} {' '} {postData.profileId.handle}
        // </Flex>
        <Flex direction='column' wrap='wrap' shadow='xl' borderWidth='1px'>
            <Flex className='postTitle' p='1' w='100%' alignItems='center' alignSelf='flex-start' direction='row' bg='blue.200'>
                <Heading
                    fontSize='lg'
                    _hover={{
                        textDecoration: 'underline',
                        // cursor: 'pointer'
                    }}
                >
                    <Tooltip px='2px' whiteSpace='nowrap' label={owner} placement='top'>
                        {name}
                    </Tooltip>
                </Heading>
                <Text fontSize='xs' mx='5px'>
                    ·
                </Text>
                <Text fontSize='xs'>
                    <ReactTimeAgo date={timestamp * 1000} locale="en-US" timeStyle="twitter" />
                </Text>
                <Spacer />
                <Box>
                    <PostItemRawdataModal post={postData} />
                </Box>
            </Flex>
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
                            <Image src={contentURI}
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
