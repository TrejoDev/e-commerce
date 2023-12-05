import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';

import { Box, Grid, Typography, TextField, Button, Link, Chip } from "@mui/material"
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from "@/components/layouts"
import { isEmail } from '@/utils';
import { AuthContext } from '@/context';

type FormData = {
    email: string;
    password: string;
    name: string;
}

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async ({ name, email, password }: FormData) => {

        setShowError(false);

        const { hasError, message } = await registerUser(name, email, password);

        if (hasError) {
            setShowError(true);
            setErrorMessage(message || '');
            setTimeout(() => { setShowError(false) }, 3000);
            return;
        };

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
        await signIn('credentials',{ email, password });
    }

    return (
        <AuthLayout title={'Register'}>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Create Account</Typography>
                        </Grid>
                        <Chip
                            label="User/password invalid"
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />

                        <Grid item xs={12}>
                            <TextField
                                {
                                ...register('name', {
                                    required: 'field required',
                                    minLength: { value: 2, message: 'At least 2 characters' }
                                })
                                }
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                label="Full name"
                                variant="filled"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {
                                ...register('email', {
                                    required: 'field required',
                                    validate: isEmail
                                })
                                }
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                type='email'
                                label="Email"
                                variant="filled"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {
                                ...register('password', {
                                    required: 'field required',
                                    minLength: { value: 6, message: 'At least 6 characters' }
                                })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                label="Password"
                                type='password'
                                variant="filled"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                Create Account
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href={ router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'} component={NextLink} variant='body2' underline='always'> Do you already have an account?</Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });

    const { p = '/' } = query;

    if ( session ) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: { }
    }
}


export default RegisterPage