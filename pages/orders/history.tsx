import { getSession } from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';

import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Full name', width: 300 },

    {
        field: 'paid',
        headerName: 'Paid',
        description: 'Shows information if the order is paid or not',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Paid" variant='outlined' />
                    : <Chip color="error" label="Unpaid" variant='outlined' />
            )
        }
    },
    {
        field: 'order',
        headerName: 'See order',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <Link href={`/orders/${params.row.orderId}`} component={NextLink} variant='body2' underline='always'>See order</Link>
            )
        }
    }
];

interface Props {
    orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map( (order, indice) => {
        return {
            id: indice + 1,
            paid: order.isPaid, 
            fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            orderId: order._id!,
        }
    } )

    return (
        <ShopLayout title={'Order history'} pageDescription={'Order history for customer'}>
            <Typography variant='h1' component='h1'>Order history</Typography>


            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 }
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}

                    />

                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrderByUser(session.user._id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage