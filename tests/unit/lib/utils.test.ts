import { describe, expect, it } from "vitest";
import { cn, formatUrlProtocol } from "~/lib/utils";

describe("utils", () => {
  describe("cn (className utility)", () => {
    it("merges class names correctly", () => {
      const result = cn("bg-red-500", "text-white");
      expect(result).toBe("bg-red-500 text-white");
    });

    it("handles conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class active-class");
    });

    it("merges conflicting Tailwind classes correctly", () => {
      // tailwind-merge should handle conflicting classes
      const result = cn("bg-red-500", "bg-blue-500");
      expect(result).toBe("bg-blue-500"); // Later class should win
    });

    it("handles undefined and null values", () => {
      const result = cn("base-class", undefined, null, "another-class");
      expect(result).toBe("base-class another-class");
    });
  });

  describe("formatUrlProtocol", () => {
    it("adds https:// to URLs without protocol", () => {
      const result = formatUrlProtocol("example.com");
      expect(result).toBe("https://example.com");
    });

    it("preserves https:// URLs", () => {
      const result = formatUrlProtocol("https://example.com");
      expect(result).toBe("https://example.com");
    });

    it("preserves http:// URLs", () => {
      const result = formatUrlProtocol("http://example.com");
      expect(result).toBe("http://example.com");
    });

    it("handles empty string", () => {
      const result = formatUrlProtocol("");
      expect(result).toBe("");
    });
  });
});