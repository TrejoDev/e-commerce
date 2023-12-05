import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Link from '@mui/material/Link';
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

import { CartContext, UiContext } from '@/context';


export const Navbar = () => {

    const router = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);

    const { gender = "all" } = router.query;

    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        router.push(`/search/${searchTerm}`);
    }




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

                <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                    className='fadeIn'
                >
                    <Link
                        href="/category/men" component={NextLink}
                        variant="body2"
                    >
                        <Button color={(gender === 'men' ? 'primary' : 'info')}>Mens</Button>
                    </Link>
                    <Link
                        href="/category/women" component={NextLink}
                        variant="body2"
                    >
                        <Button color={(gender === 'women' ? 'primary' : 'info')}>Womens</Button>
                    </Link>
                    <Link
                        href="/category/kid" component={NextLink}
                        variant="body2"
                    >
                        <Button color={(gender === 'kid' ? 'primary' : 'info')}>Kids</Button>
                    </Link>
                </Box>

                <Box flex={1} />

                {/* large viewport */}
                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className='fadeIn'
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                                type='text'
                                placeholder="Search..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setIsSearchVisible(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                onClick={() => setIsSearchVisible(true)}
                                className='fadeIn'
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }


                {/* small viewport */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <Link
                    href="/cart" component={NextLink}
                    variant="body2"
                >
                    <IconButton>
                        <Badge badgeContent={ numberOfItems } color='secondary' max={9}>
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>

                <Button onClick={toggleSideMenu}>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}
