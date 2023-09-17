import NextLink from 'next/link';

import Link from '@mui/material/Link'; 
import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';


export const Navbar = () => {
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
            <Box flex={ 1 }/>

            <Box sx={{ display: {xs: 'none', sm: 'block' } }}>
                <Link 
                    href="/category/men" component={NextLink} 
                    variant="body2"
                >
                    <Button>Mens</Button> 
                </Link>
                <Link 
                    href="/category/women" component={NextLink} 
                    variant="body2"
                >
                    <Button>Womens</Button> 
                </Link>
                <Link 
                    href="/category/kid" component={NextLink} 
                    variant="body2"
                >
                    <Button>Kids</Button> 
                </Link>
            </Box>

            <Box flex={ 1 }/>

            <IconButton>
                <SearchOutlined />
            </IconButton>
            <Link 
                href="/cart" component={NextLink} 
                variant="body2"
            >
                <IconButton>
                    <Badge badgeContent={ 2 } color='secondary'>
                        <ShoppingCartOutlined />
                    </Badge>
                </IconButton>
            </Link>

            <Button>
                Menu
            </Button>

        </Toolbar>
    </AppBar>
  )
}
