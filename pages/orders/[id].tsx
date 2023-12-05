import { useState } from 'react';
import { getSession } from 'next-auth/react'
import { PayPalButtons } from "@paypal/react-paypal-js";
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { OrderResponseBody } from '@paypal/paypal-js';

import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { Typography, Grid, Card, CardContent, Box, Divider, Chip, CircularProgress } from '@mui/material'

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'
import { tesloApi } from '@/api';


interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const { _id, isPaid, numberOfItems, shippingAddress, orderItems } = order;

    const router = useRouter();
    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async( details: OrderResponseBody ) => {

        
        
        if ( details.status !== 'COMPLETED' ) {
            return alert('There is no payment in Paypal');
        }

        setIsPaying(true);

        try {
            
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();

        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }
    }


    return (
        <ShopLayout title={`Order summary `} pageDescription={"Order summary"} >
            <Typography variant="h1" component='h1'>Order: {_id}</Typography>

            {
                isPaid
                    ? (
                        <Chip
                            sx={{ my: 2 }}
                            label='Paid order'
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />
                    )
                    : (
                        <Chip
                            sx={{ my: 2 }}
                            label='Pending payment'
                            variant='outlined'
                            color='error'
                            icon={<CreditCardOffOutlined />}
                        />

                    )
            }

            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CartList products={ orderItems } />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card" >
                        <CardContent>
                            <Typography variant="h2">Summary ({numberOfItems} {numberOfItems > 1 ? 'items' : 'item'})</Typography>


                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Delivery address</Typography>
                            </Box>

                            <Typography>Fullname: {shippingAddress.firstName} {shippingAddress.lastName} </Typography>
                            <Typography>Address: {shippingAddress.address}{shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''} </Typography>
                            <Typography>ZIP Code: {shippingAddress.zip}</Typography>
                            <Typography>City: {shippingAddress.city}</Typography>
                            <Typography>Country: {shippingAddress.country}</Typography>
                            <Typography>Phone: {shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary order={ order } />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Box 
                                    display='flex' 
                                    justifyContent='center' 
                                    className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress />
                                </Box>
                                <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}>
                                    {
                                        isPaid 
                                        ? (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label='Paid order'
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        )
                                        : (  
                                            <PayPalButtons 
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        onOrderCompleted( details );
                                                        // console.log({ details  })
                                                        // const name = details.payer.name!.given_name;
                                                        // alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                            />
                                        )
                                    }
                                </Box>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }

    return {
        props: {
            order,
        }
    }
}

export default OrderPage