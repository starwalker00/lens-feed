import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip } from '@chakra-ui/react'

function PostItem({ postData }) {
    // console.log(`postData: ${JSON.stringify(postData)}`)
    const profileId = postData.profileId.id
    const profileHandle = postData.profileId.handle

    const name = profileId.concat('#', profileHandle)
    return (
        // <Flex>
        //     {/* {JSON.stringify(postData)} */}
        //     {postData.pubId} {' '} {postData.profileId.handle}
        // </Flex>
        <Flex direction='column' wrap='wrap' p={5} shadow='md' borderWidth='1px'>
            <Tooltip><Heading alignSelf='flex-start' fontSize='lg'>{name}</Heading></Tooltip>
            <Text alignSelf='center' fontSize='md'>{name}</Text>
        </Flex>
    )
}

export default PostItem
