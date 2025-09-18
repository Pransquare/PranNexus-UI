// src/GlobalLoader.js
import React from "react";
import { useLoaderContext } from "./LoaderContext";
import FadeLoader from "react-spinners/FadeLoader";
const GlobalLoader = () => {
  const { loading } = useLoaderContext();

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        display: "flex",
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <FadeLoader color="rgb(77,208,225)" />
    </div>
  );
};

export default GlobalLoader;
