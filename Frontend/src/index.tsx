import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
render(<ChakraProvider>
    <App />
  </ChakraProvider>, document.getElementById("root"));