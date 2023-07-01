/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Saturday July 1st 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 1st 2023, 4:47:47 pm
 * ---------------------------------------------
 */

import NavBar from '@/components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body style={{ margin: 0, padding: 0 }}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
