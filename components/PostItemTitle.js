
import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Heading, Tooltip, Avatar, Link } from '@chakra-ui/react'
import PostItemRawdataModal from './PostItemRawdataModal'
import ReactTimeAgo from 'react-time-ago'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
} from '@chakra-ui/react'
import NextLink from "next/link"

function PostItemTitle({ postData }) {

    const profileId = postData.profileId.id
    const profileHandle = postData.profileId.handle
    const owner = postData.profileId.owner
    const timestamp = postData.timestamp
    // const name = profileHandle.concat('#', profileId)
    const contentURI = postData.contentURI
    const pubCount = postData.profileId.pubCount
    const imageURI = postData.profileId.imageURI
    const createdOn = postData.profileId.createdOn

    return (
        <Flex className='postTitle' p='1' ml='4' w='100%' alignItems='center' alignSelf='flex-start' direction='row'>

            <Avatar size='sm' ml='0' mr='3' mt='1' name={profileHandle} src={imageURI} />

            <Popover placement='top-end' trigger="hover">
                <PopoverTrigger>
                    <Heading
                        letterSpacing='0.02em'
                        fontSize='lg'
                        _hover={{
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}
                    >
                        <NextLink href={'/profile/'.concat(profileHandle)} passHref>
                            <Link>{profileHandle}<Text as='span' letterSpacing='0.00em' opacity='80%'>#{profileId}</Text></Link>
                        </NextLink>
                    </Heading >
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                        <Flex direction='row' alignItems='center'>
                            <Avatar size='sm' ml='0' mr='3' mt='1' name={profileHandle} src={imageURI} />
                            <Heading fontSize='md'>
                                <NextLink href={'/profile/'.concat(profileHandle)} passHref>
                                    <Link>{profileHandle} ??? ID #{profileId}</Link>
                                </NextLink>
                            </Heading >
                        </Flex>
                    </PopoverHeader>
                    <PopoverBody>
                        <Flex direction='column'>
                            <Flex wrap='wrap' alignSelf='flex-start'><Text fontSize='md'>{pubCount} publications</Text></Flex>
                            <Flex wrap='wrap'><Text fontSize='md'>Created <ReactTimeAgo date={createdOn * 1000} locale="en-US" timeStyle="twitter" /></Text></Flex>
                            <Flex wrap='wrap'><Text fontSize='md'>Owner :</Text></Flex>
                            <Flex wrap='wrap' alignSelf='center'><Text fontSize='xs'>{owner}</Text></Flex>
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

            <Text fontSize='xs' mx='5px'>
                ??
            </Text>

            <Text fontSize='xs'>
                <ReactTimeAgo date={timestamp * 1000} locale="en-US" timeStyle="twitter" />
            </Text>

            <Spacer />

            <Box mr='4'>
                <PostItemRawdataModal post={postData} />
            </Box>

        </Flex >

    )
}

export default PostItemTitle