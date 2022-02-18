
import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip } from '@chakra-ui/react'
import PostItemRawdataModal from './PostItemRawdataModal'
import ReactTimeAgo from 'react-time-ago'

function PostItemTitle({ postData }) {

    const profileId = postData.profileId.id
    const profileHandle = postData.profileId.handle
    const owner = postData.profileId.owner
    let timestamp = postData.timestamp
    const name = profileHandle.concat('#', profileId)
    const contentURI = postData.contentURI

    return (
        <Flex className='postTitle' p='1' ml='4' w='100%' alignItems='center' alignSelf='flex-start' direction='row'>
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
            <Box mr='4'>
                <PostItemRawdataModal post={postData} />
            </Box>
        </Flex>

    )
}

export default PostItemTitle