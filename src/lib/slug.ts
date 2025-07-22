/**
 * CUSTOM SLUGS FOR RESUME SHARING
 * REQUIREMENTS:
 * 1. Minimum length : 5 characters to avoid collisions
 * 2. Maximum length: 50 characters
 * 3. Restricted to lowercase alphanumeric characters
 * 4. No special characters
 * 5. Normalized characters
 *
 * Allow for customization?
 * Auto-create?
 */

/**
 * Generate a URL friendly slug from first and lastname
 */
export function generateSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase() // lowercase
    .trim() // remove whitespace at ends
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9]/g, "-") // replace non-alphanumeric with hyphen (-)
    .replace(/-+/g, "-") // remove multiple consecutive hyphens
    .replace(/^-|-$/g, ""); // remove leading/trailing hyphens
}

/**
 * Sanitize custom slug
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Slug Validation Check
 * ^(?!-)          # must not start with a hyphen
 * (?!.*--)        # must not contain two consecutive hyphens
 * [a-z0-9-]{5,50} # only lowercase letters, numbers, hyphens, 5–50 chars
 * (?<!-)$         # must not end with a hyphen
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^(?!-)(?!.*--)[a-z0-9-]{5,50}(?<!-)$/;
  return slugRegex.test(slug);
}
