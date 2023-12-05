import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import NextLink from 'next/link'

import Cookie from 'js-cookie';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from "@mui/material"

import { CartList, OrderSummary } from "@/components/cart"
import { CartContext } from '@/context'
import { ShopLayout } from "@/components/layouts"
import { countries } from '@/utils';

const SummaryPage = () => {

    const router = useRouter();
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!Cookie.get('firstName')) {
            router.push('/checkout/address');
        }

    }, [router]);

    const OnCreateOrder = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder(); //todo: depende de la response

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${ message }`)

    }


    if (!shippingAddress) {
        return <></>;
    }

    const { firstName, lastName, address, address2, city, country, phone, zip } = shippingAddress;

    return (
        <ShopLayout title='Order summary' pageDescription={"Order summary"} >
            <Typography variant="h1" component='h1'>Order summary</Typography>
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card" >
                        <CardContent>
                            <Typography variant="h2">Summary ({numberOfItems} {numberOfItems > 1 ? 'items' : 'item'})</Typography>


                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Delivery address</Typography>
                                <Link href='/checkout/address' component={NextLink} variant='body1' underline='always'>Edit</Link>
                            </Box>

                            <Typography>Fullname:  {firstName} {lastName}</Typography>
                            <Typography>Address: {address}{address2 ? `, ${address2}` : ''}</Typography>
                            <Typography>ZIP Code: {zip}</Typography>
                            <Typography>City: {city}</Typography>
                            <Typography>Country: {countries.find(c => c.code === country)?.name}</Typography>
                            <Typography>Phone: {phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <Link href='/cart' component={NextLink} variant='body1' underline='always'>Edit</Link>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Button
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth
                                    onClick={OnCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirm order
                                </Button>

                                <Chip
                                    color='error'
                                    label={errorMessage}
                                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage