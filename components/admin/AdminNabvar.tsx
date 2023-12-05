import { useContext } from 'react';
import NextLink from 'next/link';

import Link from '@mui/material/Link';
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"

import { UiContext } from '@/context';

export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <Link
                    href="/" component={NextLink}
                    variant="body2"
                    display='flex'
                    alignItems='center'
                >
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>
                <Box flex={1} />
        
                <Button onClick={toggleSideMenu}>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}
