import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./assets/main.css";

import { router } from "@/router";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const fontFamily = "Plus Jakarta Sans";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colors: {
            brand: [
              "#a7ffe5",
              "#6cfed2",
              "#68efc6",
              "#60e0b9",
              "#55c2a0",
              "#49a98a",
              "#378069",
              "#245446",
              "#0e3428",
              "#0f241e",
            ],
          },
          primaryColor: "brand",
          fontFamily,
          headings: {
            fontFamily,
            sizes: {
              h1: {
                fontWeight: 800,
                fontSize: "3rem",
                lineHeight: 1.4,
              },
            },
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
