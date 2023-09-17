import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts'

const LoginPage = () => {
  return (
    <AuthLayout title={'Log In'}>
        <Box sx={{ width: 350, padding:'10px 20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h1' component="h1">Log In</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Email" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Password" type='password' variant="filled" fullWidth />
                </Grid>

                <Grid item xs={12}>
                    <Button color="secondary" className='circular-btn' size='large' fullWidth>
                        Log In
                    </Button>
                </Grid>

                <Grid item xs={12} display='flex' justifyContent='end'>
                    <Link href='/auth/register' component={NextLink} variant='body2' underline='always'> Do you have an account?</Link>
                </Grid>
            </Grid>
        </Box>
    </AuthLayout>
  )
}

export default LoginPage