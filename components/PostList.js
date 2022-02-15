import { gql, useQuery, NetworkStatus } from '@apollo/client'
import ErrorMessage from './ErrorMessage'
import PostItem from './PostItem'

export const ALL_POSTS_QUERY = gql`
{
  posts(orderBy: timestamp orderDirection:desc first: 5) {
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
  first: 10,
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
    fetchMore({
      variables: {
        // skip: allPosts.length,
        skip: 11,
      },
    })
  }

  if (error) return <ErrorMessage message="Error loading posts." />
  if (loading && !loadingMorePosts) return <div>Loading</div>

  // const { allPosts, _allPostsMeta } = data
  // const areMorePosts = allPosts.length < _allPostsMeta.count
  const allPosts = data.posts
  const areMorePosts = false
  debugger

  return (
    <section>
      <ul>
        {allPosts.map((post, index) => (
          <PostItem postData={post} />
        ))}
      </ul>
      {areMorePosts && (
        <button onClick={() => loadMorePosts()} disabled={loadingMorePosts}>
          {loadingMorePosts ? 'Loading...' : 'Show More'}
        </button>
      )}
      <style jsx>{`
        section {
  padding - bottom: 20px;
}
        li {
  display: block;
  margin - bottom: 10px;
}
        div {
  align - items: center;
  display: flex;
}
        a {
  font - size: 14px;
  margin - right: 10px;
  text - decoration: none;
  padding - bottom: 0;
  border: 0;
}
        span {
  font - size: 14px;
  margin - right: 5px;
}
        ul {
  margin: 0;
  padding: 0;
}
button:before {
  align - self: center;
  border - style: solid;
  border - width: 6px 4px 0 4px;
  border - color: #ffffff transparent transparent transparent;
  content: '';
  height: 0;
  margin - right: 5px;
  width: 0;
}
`}</style>
    </section>
  )
}
