import { useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";

import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import Cookie from 'js-cookie';


import { ShopLayout } from "@/components/layouts";
import { countries } from '@/utils';
import { useForm } from 'react-hook-form';
import { CartContext } from '@/context';

type FormData = {
    firstName: string;
    lastName: string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;
    phone    : string;

}

const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookie.get('firstName') || '',
        lastName : Cookie.get('lastName') || '',
        address  : Cookie.get('address') || '',
        address2 : Cookie.get('address2') || '',
        zip      : Cookie.get('zip') || '',
        city     : Cookie.get('city') || '',
        country  : Cookie.get('country') || '',
        phone    : Cookie.get('phone') || '',
    }
}


const AddressPage = () => {
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState('');
    const { updateAddress } = useContext(CartContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    const onSubmitAddress = async ( data: FormData ) => {
        updateAddress( data );
        router.push('/checkout/summary');
    }

    useEffect(() => {
        if(  Cookie.get('country') ){
            setSelectedCountry(  Cookie.get('country') || countries[0].code )
        }
    }, [])
    
    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedCountry(event.target.value);
      };
    
  return (
    <ShopLayout title='Address' pageDescription='Confirm destination address'>
        <form onSubmit={ handleSubmit(onSubmitAddress) } noValidate>

        <Typography variant="h1" component='h1'>Address</Typography>
            <Grid container spacing={ 2 } sx={{ mt: 2 }}>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        {
                        ...register('firstName', {
                            required: 'field required',
                        })
                        }
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        label='Name' 
                        variant="filled" 
                        fullWidth 
                    /> 
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                    {
                    ...register('lastName', {
                        required: 'field required',
                    })
                    }
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    label='Last name' 
                    variant="filled" 
                    fullWidth 
                /> 
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        {
                        ...register('address', {
                            required: 'field required',
                        })
                        }
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        label='Address 1' 
                        variant="filled" 
                        fullWidth 
                    /> 
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        {
                        ...register('address2')
                        }
                        label='Address 2 (Optional)' 
                        variant="filled" 
                        fullWidth 
                    /> 
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        {
                        ...register('zip', {
                            required: 'field required',
                        })
                        }
                        error={!!errors.zip}
                        helperText={errors.zip?.message}
                        label='Postal Code' 
                        variant="filled" 
                        fullWidth 
                    /> 
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        {
                        ...register('city', {
                            required: 'field required',
                        })
                        }
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        label='City' 
                        variant="filled" 
                        fullWidth 
                    /> 
                </Grid>

                <Grid item xs={ 12 } sm={ 6 }>
                    <FormControl fullWidth error={!!errors.country}>
                        <InputLabel>Country</InputLabel>
                        <Select 
                            {
                                ...register('country', {
                                    required: 'field required',
                                })
                            }
                            onChange={ handleChange }
                            variant="filled"
                            label='Country'
                            value={ selectedCountry }
                        >
                            {
                                countries.map( (country) => (
                                    <MenuItem key={ country.code } value={ country.code }>{country.name}</MenuItem>
                                ) )
                            }
                        </Select>
                        <FormHelperText>{errors.country?.message}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField 
                        {
                        ...register('phone', {
                            required: 'field required',
                        })
                        }
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        label='Phone number' 
                        variant="filled" 
                        fullWidth 
                    /> 
                </Grid>
            </Grid>
            <Box sx={{ mt: 5 }} display='flex' justifyContent='initial'>
                <Button 
                    type='submit'
                    color='secondary' 
                    className="circular-btn" 
                    size="large"
                >
                    Order check
                </Button>
            </Box>
        </form>
    </ShopLayout>
  )
}



// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
//     const { token = '' } = req.cookies;

//     let isValidToken = false;

//     try {
//         await jwt.isValidToken( token );
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if( !isValidToken ){
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false,
//             }
//         }
//     }


//     return {
//         props: {
            
//         }
//     }
// }

export default AddressPage