import { FC } from 'react';
import NextLink from 'next/link'

import Link from '@mui/material/Link'; 
import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from "@mui/material";


import { initialData } from "@/database/products"
import { ItemCounter } from '../ui';

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
]

interface Props {
    editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
  return (
    <>
        {
            productsInCart.map( product => (
                <Grid container spacing={2} key={ product.slug } sx={{ mb: 1 }}>
                    <Grid item xs={ 3 }>
                        <Link href='/product/slug' component={NextLink} variant='body2'> 
                            <CardActionArea>
                                <CardMedia 
                                    image={`/products/${ product.images[0] }`}
                                    component='img'
                                    sx={{ borderRadius: '5px' }}
                                />
                            </CardActionArea>
                        </Link>
                    </Grid>
                    <Grid item xs={ 7 }>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Size: <strong>M</strong></Typography>
                            {
                                editable 
                                ? <ItemCounter />
                                : <Typography variant='h5'>3 items</Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={ 2 } display='flex' alignContent='center' flexDirection='column'>
                        <Typography variant='subtitle1'>$ { product.price }</Typography>
                        {
                            editable && (
                                <Button variant='text' color='secondary'>
                                    Remove
                                </Button>
                            )
                        }
                    </Grid>
                </Grid>
            ) )
        }
   </>
  )
}
