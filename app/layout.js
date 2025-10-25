export const metadata = {
  title: 'Harry Potter Wizard Game',
  description: 'Test your wizarding skills',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
