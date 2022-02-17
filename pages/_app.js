import { ChakraProvider } from '@chakra-ui/react'
import { theme as origTheme, extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: '#00501e',
        // background: '#e5ffbd',
        // background: '#abfe2c',
        background: '#FFFFFF',
      },
    },
  },

  components: {
    Alert: { // change the background color of the toast components with variant:subtle
      variants: {
        subtle: (props) => { // only applies to `subtle` variant
          const { colorScheme: c } = props
          if (c !== "blue") {
            // use original definition for all color schemes except "blue"
            return origTheme.components.Alert.variants.subtle(props)
          }
          return {
            container: {
              bg: `#abfe2c`, // or literal color, e.g. "#0984ff"
            },
          }
        }
      }
    }
  }
});

export default function App({ Component, pageProps }) {

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
