import NextLink from 'next/link';

import { Typography, Grid, Chip, Link } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Full name', width: 300 },

    {
        field: 'paid',
        headerName: 'Paid',
        description: 'Shows information if the order is paid or not',
        width: 200,
        renderCell: ( params: GridRenderCellParams ) => {
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
        renderCell: ( params: GridRenderCellParams ) => {
            return (
               <Link href={`/orders/${ params.row.id }`} component={NextLink} variant='body2' underline='always'>See order</Link>
            )
        }
    }
];


const rows: GridRowsProp = [
    { id: 1, paid: true, fullname: 'Fernando Herrera' },
    { id: 2, paid: false, fullname: 'Melissa Flores' },
    { id: 3, paid: true, fullname: 'Hernando Vallejo' },
    { id: 4, paid: false, fullname: 'Emin Reyes' },
    { id: 5, paid: false, fullname: 'Eduardo Rios' },
    { id: 6, paid: true, fullname: 'Natalia Herrera' },
]


const HistoryPage = () => {
  return (
    <ShopLayout title={'Order history'} pageDescription={'Order history for customer'}>
        <Typography variant='h1' component='h1'>Order history</Typography>


        <Grid container>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
            <DataGrid
                rows={ rows }
                columns={ columns }
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

export default HistoryPage