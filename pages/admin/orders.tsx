import React from 'react'

import useSWR from 'swr';
import { Chip, Grid, Typography } from '@mui/material'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '@/components/layouts'
import { IOrder, IUser } from '@/interfaces';
import orders from '../api/orders';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Full name', width: 300 },
    { field: 'total', headerName: 'Total amount', width: 300 },
    {
        field: 'isPaid', 
            headerName: 'Paid', 
            renderCell: (params: GridRenderCellParams ) => {
                return params.row.isPaid
                    ? ( <Chip variant='outlined' label='Paid' color='success' /> )
                    : ( <Chip variant='outlined' label='Pending' color='error' /> )
            }
    },
    { field: 'noProducts', headerName: 'No. Products', align: 'center', width: 150 },
    {
        field: 'check', 
            headerName: 'See order', 
            renderCell: ({row}: GridRenderCellParams ) => {
                return (
                    <a href={ `/admin/orders/${ row.id }`} target='_blank' >
                        See order
                    </a>
                )
            }
    },
    { field: 'createdAt', headerName: 'Created at', width: 300 },
]


const OrdersPage = () => {

    const { data, error, isLoading } = useSWR<IOrder[]>('/api/admin/orders');
    
    if (isLoading) return <Typography>loading...</Typography>;
    if( !data && !error ) (<></>);

    const rows = data!.map( order => ({
        id        : order._id,
        email     : (order.user as IUser).email,
        name      : (order.user as IUser).name,
        total     : order.total,
        isPaid    : order.isPaid,
        noProducts: order.numberOfItems,
        createdAt : order.createdAt,
    }) )

  return (
    <AdminLayout 
        title={'Order'} 
        subTitle={'Order maintenance'}
        icon={ <ConfirmationNumberOutlined /> }
    >
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
        
    </AdminLayout>
  )
}

export default OrdersPage