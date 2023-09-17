import NextLink from 'next/link'
import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import Link from '@mui/material/Link'; 

import { ShopLayout } from "@/components/layouts"



const EmptyPage = () => {
  return (
    <ShopLayout title='Empty cart' pageDescription='There are no items on the shopping cart'>
        <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' flexDirection={{ xs: 'column', sm: 'row' }}>
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography>Your cart is empty</Typography>
                <Link href='/' component={NextLink} variant='h4' color='secondary'>Go back</Link>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage