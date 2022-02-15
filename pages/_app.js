import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react';

import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: '#00501e',
        background: '#e5ffbd',
      },
    },
  },
});

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}
