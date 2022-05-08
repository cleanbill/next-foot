import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen bg-green-600 text-center absolute w-full ">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}