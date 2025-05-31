import { OnboardingCheck } from "~/app/_components/OnboardingCheck";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingCheck reverse>{children}</OnboardingCheck>;
}
