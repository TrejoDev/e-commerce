import { FC, useContext } from 'react';
import NextLink from 'next/link'

import Link from '@mui/material/Link'; 
import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from "@mui/material";

import { ItemCounter } from '../ui';
import { CartContext } from '@/context';
import { ICartProduct, IOrderItems } from '@/interfaces';

interface Props {
    editable?: boolean;
    products?: IOrderItems[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart, updatedCartQuantity, removeCartProduct } = useContext(CartContext);


    const onNewCartQuantity = ( product: ICartProduct, newQuantityValue: number ) => {
        product.quantity = newQuantityValue;
        updatedCartQuantity( product );
    }

    const productToShow = products ? products : cart;

  return (
    <>
        {
            productToShow.map( product => (
                <Grid container spacing={2} key={ product.slug + product.size } sx={{ mb: 1 }}>
                    <Grid item xs={ 3 }>
                        <Link href={`/product/${ product.slug }`} component={NextLink} variant='body2'> 
                            <CardActionArea>
                                <CardMedia 
                                    image={ product.image }
                                    component='img'
                                    sx={{ borderRadius: '5px' }}
                                />
                            </CardActionArea>
                        </Link>
                    </Grid>
                    <Grid item xs={ 7 }>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Size: <strong>{ product.size }</strong></Typography>
                            {
                                editable 
                                ? <ItemCounter currentValue={product.quantity} updatedQuantity={(value) => onNewCartQuantity(product as ICartProduct, value)} maxValue={ 10 } />
                                : <Typography variant='h5'>{ product.quantity } { product.quantity > 1 ? "items" : "item" }</Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={ 2 } display='flex' alignContent='center' flexDirection='column'>
                        <Typography variant='subtitle1'>$ { product.price * product.quantity }</Typography>
                        {
                            editable && (
                                <Button 
                                    variant='text' 
                                    color='secondary'
                                    onClick={ () => removeCartProduct( product as ICartProduct ) }
                                >
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
