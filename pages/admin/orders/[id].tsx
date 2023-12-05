import { NextPage, GetServerSideProps } from "next";

import { Typography, Chip, Grid, Card, CardContent, Box, Divider } from "@mui/material";
import { CreditScoreOutlined, CreditCardOffOutlined, AirplaneTicketOutlined } from "@mui/icons-material";

import { CartList, OrderSummary } from "@/components/cart";
import { AdminLayout } from "@/components/layouts";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const { _id, isPaid, numberOfItems, shippingAddress, orderItems } = order;

    return (
        <AdminLayout 
            title={`Order summary `} 
            subTitle={`Orden id: ${ _id }`}  
            icon={ <AirplaneTicketOutlined /> }
        >

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
                            <Box sx={{ mt: 3 }} display="flex" flexDirection='column'>
                            {/* TODO */}

                            <Box display='flex' flexDirection='column'>
                                {
                                    order.isPaid
                                    ? (
                                        <Chip 
                                            sx={{ my: 2, flex: 1 }}
                                            label="Orden ya fue pagada"
                                            variant='outlined'
                                            color="success"
                                            icon={ <CreditScoreOutlined /> }
                                        />

                                    ):(
                                        <Chip 
                                            sx={{ my: 2, flex: 1 }}
                                            label="Pendiente de pago"
                                            variant='outlined'
                                            color="error"
                                            icon={ <CreditCardOffOutlined /> }
                                        />
                                    )
                                }
                            </Box>

                        </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/admin/orders`,
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