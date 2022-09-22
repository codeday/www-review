import {ThemeProvider} from '@codeday/topo/Theme'

export default function CustomApp({Component, pageProps: {query, cookies, ...pageProps}}) {
    return (
        <ThemeProvider brandColor="red" cookies={cookies}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
