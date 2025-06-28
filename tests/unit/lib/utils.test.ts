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

    it("handles false conditional classes", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class");
    });

    it("merges conflicting Tailwind classes correctly", () => {
      // tailwind-merge should handle conflicting classes
      const result = cn("bg-red-500", "bg-blue-500");
      expect(result).toBe("bg-blue-500"); // Later class should win
    });

    it("handles arrays of classes", () => {
      const result = cn(["bg-red-500", "text-white"], "p-4");
      expect(result).toBe("bg-red-500 text-white p-4");
    });

    it("handles objects with conditional classes", () => {
      const result = cn({
        "bg-red-500": true,
        "text-white": false,
        "p-4": true,
      });
      expect(result).toBe("bg-red-500 p-4");
    });

    it("handles undefined and null values", () => {
      const result = cn("base-class", undefined, null, "another-class");
      expect(result).toBe("base-class another-class");
    });

    it("handles empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
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

    it("handles URLs with paths", () => {
      const result = formatUrlProtocol("example.com/path/to/page");
      expect(result).toBe("https://example.com/path/to/page");
    });

    it("handles URLs with query parameters", () => {
      const result = formatUrlProtocol("example.com/page?param=value");
      expect(result).toBe("https://example.com/page?param=value");
    });

    it("handles URLs with ports", () => {
      const result = formatUrlProtocol("localhost:3000");
      expect(result).toBe("https://localhost:3000");
    });

    it("handles empty string", () => {
      const result = formatUrlProtocol("");
      expect(result).toBe("");
    });

    it("handles URLs with subdomains", () => {
      const result = formatUrlProtocol("blog.example.com");
      expect(result).toBe("https://blog.example.com");
    });

    it("handles complex URLs with all components", () => {
      const result = formatUrlProtocol(
        "api.example.com:8080/v1/users?limit=10&offset=0",
      );
      expect(result).toBe(
        "https://api.example.com:8080/v1/users?limit=10&offset=0",
      );
    });

    it("handles URLs that already have https with paths", () => {
      const result = formatUrlProtocol("https://example.com/api/v1/data");
      expect(result).toBe("https://example.com/api/v1/data");
    });

    it("handles URLs that already have http with paths", () => {
      const result = formatUrlProtocol("http://localhost:3000/dashboard");
      expect(result).toBe("http://localhost:3000/dashboard");
    });
  });
});
