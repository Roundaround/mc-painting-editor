import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="dark-theme">
      <Head />
      <body>
        <Main />
        <div id="tooltip-portal" />
        <NextScript />
      </body>
    </Html>
  );
}
