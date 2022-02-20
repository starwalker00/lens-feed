import { request, gql } from 'graphql-request'

export const gqlEndpoint = 'https://api.thegraph.com/subgraphs/name/anudit/lens-protocol'

export const LATESTS_POST_QUERY = gql`
  query GetPosts($first: Int, $skip: Int) {
    posts(orderBy: timestamp orderDirection:desc first: $first, skip: $skip){
      id
      pubId
      profileId {
        id
        owner
        pubCount
        handle
        imageURI
        createdOn
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
  return await request(gqlEndpoint, LATESTS_POST_QUERY, allPostsQueryVars)
};


export const POSTS_BY_PROFILEID_QUERY = gql`
  query GetPostsByProfileID($first: Int, $skip: Int, $profileId: String) {
    posts(orderBy: timestamp orderDirection:desc first: $first, skip: $skip, where:{profileId:$profileId}){
      id
      pubId
      profileId {
        id
        owner
        pubCount
        handle
        imageURI
        createdOn
      }
      contentURI
      timestamp
    }
  }
`

export async function getPostsByProfileID(profileId) {
  const vars = {
    skip: 0,
    first: 20,
    profileId: profileId
  }
  return await request(gqlEndpoint, POSTS_BY_PROFILEID_QUERY, vars)
};

export const PROFILEID_FROM_PROFILEHANDLE_QUERY = gql`
  query GetProfileIDFromProfileHandle($handle: String) {
    profiles(first: 1, where:{handle:$handle}){
      id
    }
  }
`
export async function getProfileIDFromProfileHandle(profileHandle) {
  const vars = {
    handle: profileHandle,
  }
  return await request(gqlEndpoint, PROFILEID_FROM_PROFILEHANDLE_QUERY, vars)
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
