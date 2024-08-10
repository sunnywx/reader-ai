import "@radix-ui/themes/styles.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Theme, ThemePanel } from "@radix-ui/themes";
import {ReactElement} from 'react'
import {Layout} from '@/components/layout'

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page: ReactElement) => <Layout>{page}</Layout>);
  const pageElem = getLayout(<Component {...pageProps} />);

  return (
    <Theme
      accentColor="mint"
      grayColor="slate"
      panelBackground="solid"
      radius="small"
    >
      {pageElem}
      {/* <ThemePanel /> */}
    </Theme>
  );
}
