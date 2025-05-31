import { SignedInOnly } from "~/app/_components/SignedInOnly";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <SignedInOnly>{children}</SignedInOnly>;
}
