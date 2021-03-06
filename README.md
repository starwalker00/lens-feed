# Custom

## docs

- https://thegraph.com/docs/en/developer/graphql-api
- https://www.apollographql.com/docs/react/
- https://github.com/vercel/next.js/tree/canary/examples/with-apollo
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web
- https://docs.ethers.io/v5
- https://static-tweet.vercel.app/

URI management:

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
- https://www.npmjs.com/package/data-urls
- https://www.npmjs.com/package/isomorphic-dompurify (client and server compatible)
- https://github.com/cure53/DOMPurify (only client compatible)
- https://gchq.github.io/CyberChef/

Useful links:

- https://nft.storage/
- https://picsum.photos/

## subgraph memo

### endpoint

https://thegraph.com/hosted-service/subgraph/anudit/lens-protocol

### queries

```
{
    posts(orderBy: timestamp orderDirection:desc, first: 1, skip: 0){
    id
    pubId
    profileId {
      handle
    }
    timestamp
  }
}

{
    posts(where: { profileId: "26" }){
    id
    pubId
    profileId {
      id
      handle
    }
    timestamp
  }
}
```

# Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
