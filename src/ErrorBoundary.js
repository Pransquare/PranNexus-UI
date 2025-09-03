import React from "react";

export default class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    if (
      error.message ===
        "ResizeObserver loop completed with undelivered notifications." ||
      error.message === "ResizeObserver loop limit exceeded"
    ) {
      return; // ✅ skip logging this non-breaking error
    }
    console.error("Caught error in ErrorBoundary:", error, info);
  }

  render() {
    return this.props.children;
  }
}
