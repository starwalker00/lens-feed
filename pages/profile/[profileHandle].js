//example at https://github.com/lfades/static-tweet/blob/main/pages/%5Btweet%5D.js

import { useRouter } from 'next/router'
import {
    getProfileIDFromProfileHandle,
    getPostsByProfileID
} from "../../lib/getPosts";

import Head from 'next/head'
import { Container, Box, Heading, Text, Link, Flex } from '@chakra-ui/react'
import ProfilePagePostList from '../../components/ProfilePagePostList'
import PostCreator from '../../components/PostCreator'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

export default function Profile({ results }) {
    console.log(results)
    const { isFallback } = useRouter(); // waiting state
    return (
        <main>
            {isFallback ?
                <p>Fallback</p>
                :
                <Container maxWidth='container.sm' bg='white' p='0' overflow='hidden'>
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
                    {/* <Box w='100%' m="20px auto" textAlign="center">
                        <PostCreator />
                    </Box> */}
                    {/* {console.log(`fallbackData : ${JSON.stringify(fallbackData)}`)} */}
                    <Box w='100%' m="20px auto" textAlign="center">
                        <Heading as="h2" size="lg">
                            Latests Posts
                        </Heading>
                    </Box>
                    <ProfilePagePostList results={results} />
                    <Flex alignItems='center'>
                        <Flex>
                            {isFallback
                                ? 'This is statically generating.'
                                : 'This was statically generated.'}
                        </Flex>
                    </Flex>
                </Container>
            }
        </main>
    )
}

export async function getStaticPaths() {
    return { paths: [], fallback: true };
}

export async function getStaticProps({ params }) {
    const { profileHandle } = params;
    console.log(profileHandle)

    try {
        const profileID = await getProfileIDFromProfileHandle(profileHandle);
        // console.log(profileID.profiles?.[0]?.id);
        const ID = profileID.profiles[0].id
        console.log(ID)
        const results = await getPostsByProfileID(ID);
        console.log(results)
        return { props: { results } };
    } catch (error) {
        console.error(error);
        return { props: { profileHandle, notFound: true } };
    }


    return { props: { profileHandle, notFound: false } };
    // if (tweet.length > 40 || !TWEET_ID.test(tweet)) {
    //     return { notFound: true };
    // }

    // try {
    //     const ast = await fetchTweetAst(tweet);
    //     return ast ? { props: { ast } } : { notFound: true };
    // } catch (error) {
    //     // The Twitter API most likely died
    //     console.error(error);
    //     return { notFound: true };
    // }
}