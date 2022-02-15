import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer } from '@chakra-ui/react'

function PostItem({ postData }) {
    return (
        <Flex>
            {JSON.stringify(postData)}
        </Flex>
    )
}

export default PostItem
