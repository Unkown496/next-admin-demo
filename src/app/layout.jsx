import './globals.scss';

export const metadata = {
  title: 'Next Admin App',
  description: 'Next Admin App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
