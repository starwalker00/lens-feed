import { Box, Center, Flex, Image, Text, WrapItem, VStack, HStack, Spacer, Button } from '@chakra-ui/react'
import { gql, useQuery, NetworkStatus } from '@apollo/client'
import ErrorMessage from './ErrorMessage'
import PostItem from './PostItem'

export const ALL_POSTS_QUERY = gql`
  query GetPosts($first: Int, $skip: Int) {
    posts(orderBy: timestamp orderDirection:desc first: $first, skip: $skip){
      id
      pubId
      profileId {
        handle
      }
      timestamp
    }
  }
`

export const allPostsQueryVars = {
  skip: 0,
  first: 20,
}

export default function PostList() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    ALL_POSTS_QUERY,
    {
      variables: allPostsQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
    }
  )

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore

  const loadMorePosts = () => {
    console.log(`loadMorePosts`)
    console.log(`allPosts.length : ${allPosts.length}`)
    const variables = {
      skip: allPosts.length,
      // skip: 2,
    }
    fetchMore({
      variables
    })
  }

  if (error) return <ErrorMessage message="Error loading posts." />
  if (loading && !loadingMorePosts) return <div>Loading</div>

  // const { allPosts, _allPostsMeta } = data
  // const areMorePosts = allPosts.length < _allPostsMeta.count
  const allPosts = data.posts
  const areMorePosts = false

  return (
    <section>
      <ul>
        {allPosts.map((post, index) => (
          <PostItem key={index} postData={post} />
        ))}
      </ul>
      {areMorePosts && (
        <Button onClick={() => loadMorePosts()} disabled={loadingMorePosts}>
          {loadingMorePosts ? 'Loading...' : 'Show More'}
        </Button>
      )}
    </section>
  )
}
