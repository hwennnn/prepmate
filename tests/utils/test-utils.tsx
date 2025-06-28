import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { type ReactElement } from "react";

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Common test data generators
export const mockUser = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  image: null,
  emailVerified: null,
};

export const mockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

// Form test helpers
export const fillForm = async (
  getByLabelText: (text: string) => HTMLElement,
  userEvent: {
    clear: (element: HTMLElement) => Promise<void>;
    type: (element: HTMLElement, text: string) => Promise<void>;
  },
  formData: Record<string, string>,
) => {
  for (const [label, value] of Object.entries(formData)) {
    const input = getByLabelText(label);
    await userEvent.clear(input);
    await userEvent.type(input, value);
  }
};

// Wait for async operations
export const waitForAsyncOperations = () =>
  new Promise((resolve) => setTimeout(resolve, 0));
