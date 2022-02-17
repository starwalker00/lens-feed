import { Alert, AlertTitle, AlertDescription, CloseButton, Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Button, Container, Stack, Tooltip, useToast } from '@chakra-ui/react'
import PostItem from './PostItem'
import { getAllPosts, gqlEndpoint } from "../lib/getPosts";
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import axios from 'axios';
import Router from 'next/router'

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
        position: 'top',
        duration: 9000,
        isClosable: true,
        render: ({ onClose }) => (
          <Alert bg='#abfe2c' flexDirection='column' status="info" borderRadius='12px'>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription display='block'>{body}</AlertDescription>
            <Button size='sm' p='4px' m='4px' onClick={() => Router.reload(window.location.pathname)}>Reload</Button>
            <CloseButton position='absolute' onClick={onClose} right='8px' top='8px' />
          </Alert>
        ),
      });
    }
  }, [newPostsAvailable]);

  useEffect(() => {
    const revalidateStaticServerPosts = async () => {
      return await axios.get("/api/revalidate")
    }
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
      {
        results && results.posts && results.posts.map((post, index) => (
          <PostItem key={index} postData={post} />
        ))
      }
    </Stack>
  )
}
