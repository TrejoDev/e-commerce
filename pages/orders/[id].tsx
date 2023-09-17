import NextLink from 'next/link'

import { Typography, Grid, Card, CardContent, Box, Divider, Link, Chip } from '@mui/material'

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'



const OrderPage = () => {
  return (
    <ShopLayout title='Order summary ID#' pageDescription={"Order summary"} >
        <Typography variant="h1" component='h1'>Order: ID#</Typography>

        {/* <Chip
            sx={{ my: 2 }}
            label='Pending payment'
            variant='outlined'
            color='error'
            icon={ <CreditCardOffOutlined /> }
        /> */}
        <Chip
            sx={{ my: 2 }}
            label='Paid order'
            variant='outlined'
            color='success'
            icon={ <CreditScoreOutlined /> }
        />

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className="summary-card" >
                    <CardContent>
                        <Typography variant="h2">Summary (3 Products)</Typography>
                       

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Delivery address</Typography>
                            <Link href='/checkout/address' component={NextLink} variant='body1' underline='always'>Edit</Link>
                        </Box>

                        <Typography>Fernando Herrera</Typography>
                        <Typography>Address</Typography>
                        <Typography>CityZIP</Typography>
                        <Typography>PhoneNumbre</Typography>

                        <Divider sx={{ my: 1 }}/>

                        <Box display='flex' justifyContent='end'>
                            <Link href='/cart' component={NextLink} variant='body1' underline='always'>Edit</Link>
                        </Box>

                        <OrderSummary />    

                        <Box sx={{ mt: 3 }}>
                            {/* todo: */}
                            <h1>Pay</h1>

                            <Chip
                                sx={{ my: 2 }}
                                label='Paid order'
                                variant='outlined'
                                color='success'
                                icon={ <CreditScoreOutlined /> }
                            />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default OrderPage