"use client";

// Error Boundary to wrap our componenets and monitor the children for error
// @see https://legacy.reactjs.org/docs/error-boundaries.html

import { Component, type ReactNode } from "react";
import { ErrorMessage, type ErrorUIProps } from "~/components/ErrorMessage";

// Defining our ErrorBoundary States and Properties (incl custom) for type safety
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps extends ErrorUIProps {
  children: ReactNode;
}

// React only support error boundaries as class components
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // Initializing non-error state
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // useState and useEffect does not work for error boundaries, so we use the following lifecycle methods
  // 1. to redner fallback UI
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }
  // 2. Log error information
  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("ErrorBoundary caught error: ", error, errorInfo);
  }

  // Handle Retry Anonymous function, triggered only onClick
  handleRetry = () => {
    // Explictly "clear" the error, to trigger the re-render
    // any errors in re-render will be caught by boundary again
    this.setState({ hasError: false, error: undefined });
  };

  // Render the ErrorMessage component if state has error.
  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorMessage
          error={this.state.error}
          title={this.props.title ?? "Oops! Something went wrong."}
          description={
            this.props.description ?? "This component encountered an error."
          }
          retry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}
