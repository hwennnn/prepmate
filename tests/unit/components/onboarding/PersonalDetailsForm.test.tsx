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

  it("renders all form fields", () => {
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

  it("shows required field indicators", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    // Check for asterisks (*) in required field labels
    expect(screen.getByText(/first name \*/i)).toBeInTheDocument();
    expect(screen.getByText(/last name \*/i)).toBeInTheDocument();
    expect(screen.getByText(/email \*/i)).toBeInTheDocument();
  });

  it("displays correct placeholders", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("john.doe@example.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("+1 (555) 123-4567"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("https://yourwebsite.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("https://linkedin.com/in/yourname"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("https://github.com/yourname"),
    ).toBeInTheDocument();
  });

  it("calls register for all form fields", () => {
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
        lastName: { message: "Last name is required" },
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
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("does not display error messages when no errors", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });

  it("has proper form structure and accessibility", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    // Check for proper labeling
    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);

    expect(firstName).toHaveAttribute("id", "firstName");
    expect(lastName).toHaveAttribute("id", "lastName");
    expect(email).toHaveAttribute("id", "email");

    // Check card structure
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("applies correct CSS classes for styling", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    const card = screen
      .getByText("Personal Information")
      .closest('[class*="border-slate-200"]');
    expect(card).toBeInTheDocument();
  });

  it("renders form inputs with correct attributes", () => {
    render(<PersonalDetailsForm {...defaultProps} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(7); // All form fields

    // Check that inputs have the bg-white class
    inputs.forEach((input) => {
      expect(input).toHaveClass("bg-white");
    });
  });
});
