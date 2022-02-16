import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react';

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

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
