import NextLink from 'next/link'

import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link } from "@mui/material"

import { CartList, OrderSummary } from "@/components/cart"
import { ShopLayout } from "@/components/layouts"

const SummaryPage = () => {
  return (
    <ShopLayout title='Order summary' pageDescription={"Order summary"} >
        <Typography variant="h1" component='h1'>Order summary</Typography>
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
                            <Button color="secondary" className="circular-btn" fullWidth>
                                Confirm order
                            </Button>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage