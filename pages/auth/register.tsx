import NextLink from 'next/link';
import { Box, Grid, Typography, TextField, Button, Link } from "@mui/material"

import { AuthLayout } from "@/components/layouts"


const RegisterPage = () => {
  return (
    <AuthLayout title={'Register'}>
        <Box sx={{ width: 350, padding:'10px 20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h1' component="h1">Create Account</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Full name" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Email" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Password" type='password' variant="filled" fullWidth />
                </Grid>

                <Grid item xs={12}>
                    <Button color="secondary" className='circular-btn' size='large' fullWidth>
                        Create Account
                    </Button>
                </Grid>

                <Grid item xs={12} display='flex' justifyContent='end'>
                    <Link href='/auth/login' component={NextLink} variant='body2' underline='always'> Do you already have an account?</Link>
                </Grid>
            </Grid>
        </Box>
    </AuthLayout>
  )
}

export default RegisterPage