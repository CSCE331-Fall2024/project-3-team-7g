import './globals.css';
import Navbar from './menuBoard/components/Navbar';

export const metadata = {
  title: 'Panda Express',
  description: 'An application for customers and employees of Panda Express',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <main className="p-0">{children}</main>
      </body>
    </html>
  );
}
