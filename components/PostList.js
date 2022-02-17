import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Button, Container, Stack, Tooltip, useToast } from '@chakra-ui/react'
import PostItem from './PostItem'
import { getAllPosts, gqlEndpoint } from "../lib/getPosts";
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import axios from 'axios';

async function fetcher() {
  console.log(`fetcher`)
  const results = await getAllPosts()
  const lastPostId = results.posts[0].id
  console.log(`lastPostId : ${JSON.stringify(lastPostId)}`)
  return lastPostId
}

async function revalidateStaticServerPosts() {
  const res = await axios.get("/api/revalidate");
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
  // toast for new posts
  const toastMessage = {
    title: "New posts found",
    body: `Reload the page to see them`
  }
  const toast = useToast();
  useEffect(() => {
    if (newPostsAvailable && toastMessage) {
      const { title, body } = toastMessage;
      toast({
        title: `${title}`,
        description: `${body}`,
        // status: 'error',
        variant: 'subtle',
        position: 'top',
        duration: 9000,
        isClosable: true,
        containerStyle: {
          // width: '800px',
          // maxWidth: '100%',
          background: 'blue',
          borderRadius: '25% 10%'
        },
      });
    }
  }, [newPostsAvailable]);

  useEffect(() => {
    const revalidateStaticServerPosts = async () => {
      return await axios.get("/api/revalidate")
    }
    // try {
    //   const response = await revalidateStaticServerPosts()
    //   console.log(`revalidated : ${response.data.revalidated}`)
    // } catch (error) {
    //   console.log(`revalidation error :`)
    //   console.error(error);
    // }
    revalidateStaticServerPosts()
      .then(response => {
        console.log(`revalidated : ${response.data.revalidated}`)
      })
      .catch(error => {
        console.log(`revalidation error :`)
        console.error(error);
      })
  }, [newPostsAvailable])

  return (
    <Stack direction={['column']} spacing={0}>
      {/* {newPostsAvailable
        ?
        <Box>new posts, reload the page to consult them</Box>
        :
        null // <Box>no new posts</Box>
      } */}
      {
        results && results.posts && results.posts.map((post, index) => (
          <PostItem key={index} postData={post} />
        ))
      }
    </Stack>
  )
}
