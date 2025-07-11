"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { liveRenderer } from "~/lib/typst-renderer";

interface UseLivePreviewOptions {
  formData: OnboardingFormData;
  templateId: string;
  enabled?: boolean;
}

export function useLivePreview({
  formData,
  templateId,
  enabled = true,
}: UseLivePreviewOptions) {
  // States to manage
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // error state
  const [svgContent, setSVGContent] = useState<string[] | null>(); // svg content state
  const [isInitialized, setInitialized] = useState(false); // Initialization state

  // Initialization promise reference (persistent so no re-initialization of compiler)
  const initPromiseRef = useRef<Promise<void> | undefined>(undefined);

  // Timer storage (persistent across calls)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cached data
  const lastDataRef = useRef<string>("");

  // Initialization
  const initialize = useCallback(async () => {
    // Promise<void | null>
    // Checks if initPromise has returned Promise<void>
    if (initPromiseRef.current) return initPromiseRef.current;

    try {
      // Initialization logic
      setIsLoading(true); // Show Loading
      initPromiseRef.current = liveRenderer.initialize();
      await initPromiseRef.current;
      setInitialized(true); // set intialization state true
      //setIsLoading(false); // Stop showing loading
      return initPromiseRef.current; // return Promise<void>
    } catch (error) {
      // Swallow error
      console.error("Error initializing renderer: ", error);
      initPromiseRef.current = undefined; // clear initialization, reset initPromise
      setIsLoading(false); // Stop loading
      setError("Error initializing renderer."); // Set error message for error handling
      return null; // return null instead of undefined to clearly show initialization failure.
    }
  }, []); // No dependency

  // Render
  const render = useCallback(async () => {
    // Promise<void>
    // do nothing if livepreview not enabled or typst compiler not initialized
    if (!enabled || !isInitialized) return;

    // Check if any changes (cacheing)
    const currentData = JSON.stringify({ formData, templateId });
    if (lastDataRef.current === currentData) return;

    // Else, we render
    setIsLoading(true); // Load first
    setError(null); // Clear any errors

    // main logic
    try {
      // Render live preview content
      const svgContent = await liveRenderer.renderToSVG({
        formData,
        templateId,
      });

      // Update svgContent state with new content
      setSVGContent(svgContent);

      // Update lastDataRef
      lastDataRef.current = currentData;
    } catch (error) {
      console.error("Error rendering: ", error);
      // Update error state
      setError("Error loading resume (live): ");
    } finally {
      // Removing loading
      setIsLoading(false);
    }
  }, [formData, templateId, isInitialized, enabled]);

  // Debounce render function,
  // to be called each time there is a change in form data
  const debouncedRender = useCallback(() => {
    // void
    // Clear timer for each call to reset timer
    clearTimeout(timerRef.current);

    // Create new and update timer
    timerRef.current = setTimeout(() => {
      // anonymous function here runs after timeout
      void render(); // ignore promise
    }, 1000);
  }, [render]);

  // Manual refresh function
  const refresh = useCallback(() => {
    if (enabled && isInitialized) {
      lastDataRef.current = ""; // Force re-render
      void render();
    }
  }, [enabled, isInitialized, render]);

  // Triggers
  // Initialization
  useEffect(() => {
    // only initialize if enabled and not initialized yet
    if (enabled && !isInitialized) {
      void initialize();
    }
  }, [enabled, isInitialized, initialize]);

  // Renders on change of svgContent
  useEffect(() => {
    if (enabled && isInitialized) debouncedRender();
  }, [formData, templateId, enabled, isInitialized, debouncedRender]);

  // Clean Up timer
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Return
  return {
    isLoading,
    error,
    svgContent,
    isInitialized,
    refresh,
  };
}

/*
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OnboardingFormData } from "~/app/_components/onboarding/types";
import { liveRenderer } from "~/lib/typst-renderer";

interface UseLivePreviewOptions {
  formData: OnboardingFormData;
  templateId: string;
  enabled?: boolean;
  debounceMs?: number;
}

interface LivePreviewState {
  isLoading: boolean;
  error: string | null;
  svgContent: string | null;
  isInitialized: boolean;
}

export function useLivePreview({
  formData,
  templateId,
  enabled = true,
  debounceMs = 300,
}: UseLivePreviewOptions) {
  const [state, setState] = useState<LivePreviewState>({
    isLoading: false,
    error: null,
    svgContent: null,
    isInitialized: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastDataRef = useRef<string>("");
  const initializationRef = useRef<Promise<void> | null>(null);

  // Initialize the renderer
  const initialize = useCallback(async () => {
    if (initializationRef.current) {
      return initializationRef.current;
    }

    initializationRef.current = (async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        await liveRenderer.initialize();
        setState((prev) => ({ ...prev, isInitialized: true }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Initialization failed",
        }));
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    })();

    return initializationRef.current;
  }, []);

  // Render function
  const render = useCallback(async () => {
    if (!enabled || !state.isInitialized) return;

    const currentData = JSON.stringify({ formData, templateId });
    if (currentData === lastDataRef.current) return;

    lastDataRef.current = currentData;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const svgContent = await liveRenderer.renderToSVG({
        formData,
        templateId,
      });

      setState((prev) => ({
        ...prev,
        svgContent,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Rendering failed",
        isLoading: false,
      }));
    }
  }, [formData, templateId, enabled, state.isInitialized]);

  // Debounced render function
  const debouncedRender = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      void render();
    }, debounceMs);
  }, [render, debounceMs]);

  // Initialize on mount
  useEffect(() => {
    if (enabled) {
      void initialize();
    }
  }, [enabled, initialize]);

  // Trigger render when data changes
  useEffect(() => {
    if (enabled && state.isInitialized) {
      debouncedRender();
    }
  }, [formData, templateId, enabled, state.isInitialized, debouncedRender]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Manual refresh function
  const refresh = useCallback(() => {
    if (enabled && state.isInitialized) {
      lastDataRef.current = ""; // Force re-render
      void render();
    }
  }, [enabled, state.isInitialized, render]);

  return {
    ...state,
    refresh,
  };
}
*/
