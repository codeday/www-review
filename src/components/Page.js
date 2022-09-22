import React from 'react';
import { CodeDay, Box } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { Header, Footer, SiteLogo } from '@codeday/topo/Organism';

export default function Page({
    children, title, ...props
                             }) {
    return (
        <Box position="relative">
            <Header underscore position="relative">
                <SiteLogo>
                    <a href="/">
                        <CodeDay text="Resume Review" />
                    </a>
                </SiteLogo>
            </Header>
            <Content>
                {children}
            </Content>
            <Footer repository="www-review" branch="main" mt={16} />
        </Box>
    )
}
