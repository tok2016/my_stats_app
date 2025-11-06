import ConfirmationProvider from '@store/ConfirmationProvider';

export default function ResetPasswordLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ConfirmationProvider>{children}</ConfirmationProvider>;
}
