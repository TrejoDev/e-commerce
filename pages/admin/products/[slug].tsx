import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';

import { Controller, ControllerFieldState, ControllerRenderProps, FieldValues, useForm, UseFormStateReturn } from 'react-hook-form';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { dbProducts } from '../../../database';
import { tesloApi } from '@/axiosApi';
import { Product } from '@/models';


const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTagValue, setNewTagValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues, setValue, control, watch } = useForm<FormData>({
    defaultValues: product
  })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'title') {
        const newSlug = value.title?.trim()
          .replace(/\s+/g, "_")
          .replace(/[^\w-]+/g, "")
          .toLowerCase() || '';

        setValue('slug', newSlug);
      }
    })
    return () => subscription.unsubscribe();
  }, [watch, setValue])

  // const onChangeSize = (size: string) => {
  //   const currentSizes = getValues('sizes');

  //   if (currentSizes.includes(size)) {
  //     return setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true })
  //   }
  //   setValue('sizes', [...currentSizes, size], { shouldValidate: true });
  // }

  const onNewTag = ( ) => {
    const newTag = newTagValue.trim().toLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');

    if( currentTags.includes( newTag ) ) return;
    currentTags.push( newTag );
  }

  const onDeleteTag = (tag: string) => {
     const updatedTags = getValues('tags').filter( t => t !== tag );
     setValue('tags', updatedTags, { shouldValidate: true }  )
  }

  
  
  const onFilesSelected = async ( { target }: ChangeEvent<HTMLInputElement> ) => {
    if( !target.files || target.files.length === 0 ) return;

    try {
      for ( const file of target.files ){
        const formData = new FormData();
        formData.append( 'file', file );
        const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData );
        setValue('images', [...getValues('images'), data.message ], { shouldValidate: true });
      }
      
    } catch (error) {     
    }
  }

  const onDeleteImage = ( image: string ) => {
    setValue('images', getValues('images').filter( img => img != image ), { shouldValidate: true } )
  }

  const onSubmit = async (form: FormData) => {
    if( form.images.length < 2 ) return alert('At least two images');
    setIsSaving(true);

    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        method: form._id ? 'PUT' : 'POST', //si tenemos un id actualizar, si no crear un nuevo producto
        data: form
      })
      console.log({data})
      if( !form._id ){
        router.replace(`/admin/products/${ form.slug }`)
      } else{
        setIsSaving(false)
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }

  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  return (
    <AdminLayout
      title={'Product'}
      subTitle={`Editing: ${product.title}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type="submit"
            disabled={ isSaving }
          >
            Save
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>

            <Controller
              name="title"
              rules={{
                required: 'This field is required',
                minLength: {
                  value: 2,
                  message: 'Minimum 2 characters'
                }
              }}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  variant="filled"
                  fullWidth
                  rows={5} // <-- ESTO LO ARREGLA
                  sx={{ mb: 1 }}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            <Controller
              name="description"
              rules={{
                required: 'This field is required',
                minLength: {
                  value: 8,
                  message: 'You must type at least 8 characters!'
                }
              }}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  variant="filled"
                  fullWidth
                  rows={5} // <-- ESTO LO ARREGLA
                  sx={{ mb: 1 }}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Controller
              name="inStock"
              rules={{
                required: 'This field is required',
                min: { value: 0, message: 'Minimum value 0' }
              }}
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock"
                  variant="filled"
                  fullWidth
                  rows={5} // <-- ESTO LO ARREGLA
                  sx={{ mb: 1 }}
                  error={!!errors.inStock}
                  helperText={errors.inStock?.message}
                />
              )}
            />
            <Controller
              name="price"
              rules={{
                required: 'This field is required',
                min: { value: 0, message: 'Minimum value 0' }
              }}
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  variant="filled"
                  fullWidth
                  rows={5} // <-- ESTO LO ARREGLA
                  sx={{ mb: 1 }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />

            <Divider sx={{ my: 1 }} />

            <Controller
              name="type"
              control={control}
              defaultValue={ undefined }
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <RadioGroup row {...field}>
                    {validTypes.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color="secondary" />}
                        label={capitalize(option)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
            <Controller
              name="gender"
              control={control}
              defaultValue={ undefined }
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup row {...field}>
                    {validGender.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color="secondary" />}
                        label={capitalize(option)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
            <Controller
              name="sizes"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="dense" error={!!errors.sizes}>
                  <FormLabel>Sizes</FormLabel>
                  <FormGroup>
                    {validSizes.map((size) => (
                      <FormControlLabel
                        key={size}
                        label={size}
                        control={
                          <Checkbox
                            value={size}
                            checked={field.value.some((val) => val === size)}
                            onChange={({ target: { value } }, checked) => {
                              checked
                                ? field.onChange([...field.value, value])
                                : field.onChange(
                                  field.value.filter((val) => val !== value)
                                );
                            }}
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                  <FormHelperText>
                    {capitalize(`${(errors.sizes as any)?.message || ''}`)}
                  </FormHelperText>
                </FormControl>
              )}
            />

          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              rows='5'
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'This field is required',
                validate: (val) => val.trim().includes(' ') ? 'There cannot be empty spaces' : undefined
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              value={newTagValue}
              onChange={ ({ target }) => setNewTagValue(  target.value )  }
              onKeyUp={({code}) => code === 'Space' ? onNewTag() : undefined}
              label="Labels"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Press [spacebar] to add"
            />

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
              component="ul">
              {
                getValues('tags').map((tag) => {
                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => onDeleteTag(tag)}
                      color="primary"
                      size='small'
                      sx={{ ml: 1, mt: 1 }}
                    />
                  );
                })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Pictures</FormLabel>
              {/* <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={ () => fileInputRef.current?.click() }
              >
                Upload picture
                <input
                  ref={ fileInputRef }
                  type='file'
                  multiple
                  accept='image/png, image/gif, image/jpeg'
                  style={{ display: 'none' }}
                  onChange={ onFilesSelected }
                >
                </input>
              </Button> */}
              <Button 
                  color="secondary"
                  fullWidth
                  component="label" 
                  sx={{ mb: 3 }}
                  variant="contained" 
                  startIcon={ <CloudUploadIcon /> }
              >
                  Cargar imagen

                  <VisuallyHiddenInput                  
                    type="file" 
                    multiple 
                    accept='image/png, image/gif, image/jpeg'
                    onChange={ onFilesSelected }
                  />
              </Button>
                
              <Chip
                label="It is necessary to 2 images"
                color='error'
                variant='outlined'
                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
              />

              <Grid container spacing={2}>
                {
                  getValues('images').map(img => (
                    <Grid item xs={4} sm={3} key={img}>
                      <Card>
                        <CardMedia
                          component='img'
                          className='fadeIn'
                          image={ img }
                          alt={img}
                        />
                        <CardActions>
                          <Button 
                            fullWidth 
                            color="error"
                            onClick={ () => onDeleteImage(img) }
                            >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>

            </Box>

          </Grid>

        </Grid>
      </form>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const { slug = '' } = query;

  let product: IProduct | null;

  if ( slug === 'new' ){
    // Crea un nuevo producto
    const tempProduct = JSON.parse( JSON.stringify( new Product()   ) );
    delete tempProduct._id;
    tempProduct.images = [ 'img1.jpg', 'img2.jpg' ];
    product = tempProduct;

  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      }
    }
  }


  return {
    props: {
      product
    }
  }
}


export default ProductAdminPage




