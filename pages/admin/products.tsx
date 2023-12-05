import React from 'react'
import NextLink from 'next/link'
import Link from '@mui/material/Link'; 

import useSWR from 'swr';
import { Box, Button, CardMedia, Grid, Typography } from '@mui/material'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '@/components/layouts'
import {  IProduct } from '@/interfaces';

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Picture',
        renderCell: ( {row}: GridRenderCellParams ) => {
            return (
                <a 
                    href={ `/product/${ row.slug }`}  
                    target='_blank' rel='noreferrer'
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                      }}
                >  
                    <CardMedia 
                        component='img'
                        alt={ row.title }
                        className='fadeIn'
                        image={ row.img }
                        sx={{
                            height:'100%',
                            objectFit: 'contain',
                          }}
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Title', 
        width: 250,
        renderCell({row}: GridRenderCellParams ) {
            return (
                <Link href={ `/admin/products/${ row.slug }` } component={NextLink} variant='body2' underline='always'>{row.title}</Link>
            )
        },
    },
    { field: 'gender', headerName: 'Gender' },
    { field: 'inStock', headerName: 'Stock' },
    { field: 'price', headerName: 'Price' },
    { field: 'sizes', headerName: 'Sizes', width: 250 },
    
]


const ProductsPage = () => {

    const { data, error, isLoading } = useSWR<IProduct[]>('/api/admin/products');
    
    if (isLoading) return <Typography>loading...</Typography>;
    if( !data && !error ) (<></>);

    const rows = data!.map( product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
        
    }) )

  return (
    <AdminLayout 
        title={`Products (${ data?.length })`} 
        subTitle={'Products maintenance'}
        icon={ <CategoryOutlined /> }
    >
        <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
            <Button
                startIcon={ <AddOutlined /> }
                color='secondary'
                href='/admin/products/new'
            >
                Create product    
            </Button>
        </Box>
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

export default ProductsPage