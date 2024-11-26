// import './globals.css';

// export const metadata = {
//   title: 'Panda Express',
//   description: 'An application for customers and employees of Panda Express',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-100">
//         <main className="p-0">{children}</main>
//       </body>
//     </html>
//   );
// }


import './globals.css';
import { LanguageProvider } from './LanguageContext'; // Import the context
import LanguageSelector from './components/LanguageSelector'; // Language selector component

export const metadata = {
  title: 'Panda Express',
  description: 'An application for customers and employees of Panda Express',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <LanguageProvider>
          <header>
            <LanguageSelector /> {/* Add the selector to the header */}
          </header>
          <main className="p-0">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}

