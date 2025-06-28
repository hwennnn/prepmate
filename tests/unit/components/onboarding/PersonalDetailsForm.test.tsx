import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalDetailsForm } from "~/app/_components/onboarding/PersonalDetailsForm";
import { render, screen } from "../../../utils/test-utils";

// Mock register function for testing
const mockRegister = vi.fn((name: string) => ({
  name,
  ref: vi.fn(),
  onChange: vi.fn(),
  onBlur: vi.fn(),
}));

describe("PersonalDetailsForm", () => {
  const defaultProps = {
    register: mockRegister,
    errors: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all required and optional form fields", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    // Required fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    // Optional fields
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personal website/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/linkedin url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/github url/i)).toBeInTheDocument();
  });

  it("registers all form fields correctly", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    expect(mockRegister).toHaveBeenCalledWith("personalDetails.firstName");
    expect(mockRegister).toHaveBeenCalledWith("personalDetails.lastName");
    expect(mockRegister).toHaveBeenCalledWith("personalDetails.email");
    expect(mockRegister).toHaveBeenCalledWith("personalDetails.phoneNumber");
    expect(mockRegister).toHaveBeenCalledWith("personalDetails.website");
    expect(mockRegister).toHaveBeenCalledWith("personalDetails.linkedinUrl");
    expect(mockRegister).toHaveBeenCalledWith("personalDetails.githubUrl");
  });

  it("displays validation errors when provided", () => {
    const errorsWithMessages = {
      personalDetails: {
        firstName: { message: "First name is required" },
        email: { message: "Invalid email address" },
      },
    };

    render(
      <PersonalDetailsForm
        register={mockRegister}
        errors={errorsWithMessages}
      />,
    );

    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("has proper accessibility structure", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    // Check for proper labeling on key fields
    const firstName = screen.getByLabelText(/first name/i);
    const email = screen.getByLabelText(/email/i);

    expect(firstName).toHaveAttribute("id", "firstName");
    expect(email).toHaveAttribute("id", "email");
  });
});