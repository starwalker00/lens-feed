import Head from 'next/head'
import { Container, Box, Heading, Text, Link } from '@chakra-ui/react'
import PostList from '../components/PostList'
import PostCreator from '../components/PostCreator'
import { getAllPosts } from "../lib/getPosts";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

export default function Home({ fallbackData }) {

  return (
    <Container maxWidth='container.sm' m="20px auto" bg='white' p='0'>
      <Head>
        <title>Lens feed</title>
        <meta name="description" content="Lens Protocol global feed with post feature" />
        <link rel="icon" href="/flower.svg" />
      </Head>
      <Box w='100%' m="20px auto" textAlign="center">
        <Heading as="h1" size="xl">
          Lens feed
        </Heading>
        <Text fontSize='lg' mt="10px" letterSpacing='.12rem'>
          global feed of posts on Lens Protocol
        </Text>
      </Box>
      <Box w='100%' m="20px auto" textAlign="center">
        <PostCreator />
      </Box>
      {/* {console.log(`fallbackData : ${JSON.stringify(fallbackData)}`)} */}
      <Box w='100%' m="20px auto" textAlign="center">
        <Heading as="h2" size="lg">
          Latests Posts
        </Heading>
      </Box>
      <PostList results={fallbackData} />
    </Container>
  )
}

export async function getStaticProps({ reload }) {
  console.log(reload)
  // `getStaticProps` is executed on the server side.
  const results = await getAllPosts();

  return {
    props: {
      fallbackData: results
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every ${revalidate} seconds
    revalidate: 1, // In seconds
  }
}
