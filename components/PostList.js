import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Button, Container, Stack, Tooltip } from '@chakra-ui/react'
import PostItem from './PostItem'
import { getAllPosts, gqlEndpoint } from "../lib/getPosts";
import useSWR from 'swr'

async function fetcher() {
  console.log(`fetcher`)
  const results = await getAllPosts()
  const lastPostId = results.posts[0].id
  console.log(`lastPostId : ${JSON.stringify(lastPostId)}`)
  return lastPostId
}

export default function PostList({ results }) {
  // console.log(results.posts)

  // this hook compares the last returned post id regularly to check if there are more posts to load
  // this indicates the user that he can see these posts by reloading the page
  // in the future, do it without reloading the page (with a better hook)
  const { data, error, isValidating } = useSWR(results.posts[0].id, fetcher,
    {
      revalidateOnMount: false,
      fallbackData: results.posts[0].id,
      refreshInterval: 5000
    }
  )
  const newPostsAvailable = !(data === results.posts[0].id)

  return (
    <Stack direction={['column']} spacing={0}>
      {newPostsAvailable
        ?
        <Box>new posts, reload the page to consult them</Box>
        :
        null // <Box>no new posts</Box>
      }
      {
        results && results.posts && results.posts.map((post, index) => (
          <PostItem key={index} postData={post} />
        ))
      }
    </Stack>
  )
}
