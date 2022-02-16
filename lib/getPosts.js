import { request, gql } from 'graphql-request'

export const gqlEndpoint = 'https://api.thegraph.com/subgraphs/name/anudit/lens-protocol'

export const POST_QUERY = gql`
  query GetPosts($first: Int, $skip: Int) {
    posts(orderBy: timestamp orderDirection:desc first: $first, skip: $skip){
      id
      pubId
      profileId {
        id
        handle
        owner
      }
      contentURI
      timestamp
    }
  }
`

export async function getAllPosts() {
  const allPostsQueryVars = {
    skip: 0,
    first: 42,
  }
  return await request(gqlEndpoint, POST_QUERY, allPostsQueryVars)
};

// not used for now
// export async function useAllPosts() {
//   const swr = useSWR(gqlEndpoint, fetcher, config);
//   const isLoading = !swr.error && !swr.data;
//   return {
//     ...swr,
//     isLoading,
//   };
// };
