import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip } from '@chakra-ui/react'
import ReactTimeAgo from 'react-time-ago'
import PostItemRawdataModal from './PostItemRawdataModal'

function PostItem({ postData }) {
    // console.log(`postData: ${JSON.stringify(postData)}`)
    const profileId = postData.profileId.id
    const profileHandle = postData.profileId.handle
    const owner = postData.profileId.owner
    let timestamp = postData.timestamp
    const name = profileHandle.concat('#', profileId)
    // const contentURI = postData.contentURI

    // async function(contentURI) {

    // }


    return (
        // <Flex>
        //     {/* {JSON.stringify(postData)} */}
        //     {postData.pubId} {' '} {postData.profileId.handle}
        // </Flex>
        <Flex direction='column' wrap='wrap' shadow='xl' borderWidth='1px'>
            <Flex className='postTitle' w='100%' alignItems='center' alignSelf='flex-start' direction='row' bg='blue.200'>
                <Heading
                    fontSize='lg'
                    _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer'
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
                <Box>
                    <PostItemRawdataModal post={postData} />
                </Box>
            </Flex>
            <Flex className='postContent'>
                <Text alignSelf='center' fontSize='md'>{name}</Text>
            </Flex >
        </Flex >
    )
}

export default PostItem
