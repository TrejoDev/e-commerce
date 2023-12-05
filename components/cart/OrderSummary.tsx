import { FC, useContext } from "react";

import { Divider, Grid, Typography } from "@mui/material";

import { CartContext } from "@/context";
import { format } from '../../utils'
import { IOrder } from "@/interfaces";

interface Props {
    order?: IOrder;
}

export const OrderSummary: FC<Props> = ({ order }) => {

    const cartOrder = useContext(CartContext);
    
    const { numberOfItems, subTotal, tax, total } = order ? order : cartOrder;

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>Products</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography> {numberOfItems} {numberOfItems > 1 ? 'items' : 'item'} </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{format(subTotal)}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography>Taxes {Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{format(tax)}</Typography>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
                <Divider sx={{ width: '100%', mb: 2 }} />
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Total: </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
                <Typography>{format(total)}</Typography>
            </Grid>

        </Grid>
    )
}
