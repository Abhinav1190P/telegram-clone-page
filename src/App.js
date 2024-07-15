import * as React from 'react'

import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import Layout from './components/Layout';
function App() {

  return (
    <ChakraProvider>
      <ColorModeProvider>
        <Layout />
      </ColorModeProvider>
    </ChakraProvider>
  )
}


export default App;
