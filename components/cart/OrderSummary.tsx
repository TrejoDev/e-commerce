import { Grid, Typography } from "@mui/material"

export const OrderSummary = () => {
  return (
    <Grid container>
        <Grid item xs={ 6 }>
            <Typography>Products</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography> 3 items</Typography>
        </Grid>
        <Grid item xs={ 6 }>
            <Typography>Subtotal</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>${ 200.00 }</Typography>
        </Grid>
        <Grid item xs={ 6 }>
            <Typography>Taxes (15%)</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>${30.00 }</Typography>
        </Grid>
        
        <Grid item xs={ 6 } sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Total: </Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>${230.00 }</Typography>
        </Grid>
       
    </Grid>
  )
}
