import { useContext, useEffect, useState } from 'react';
import { /* GetServerSideProps */ NextPage, GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import 'react-slideshow-image/dist/styles.css'

import { ShopLayout } from "@/components/layouts"
import { ProductSlideshow, SizeSelector } from "@/components/products";
import { ItemCounter } from "@/components/ui";
import { ICartProduct, IProduct, ISize } from "@/interfaces";
import { dbProducts } from '@/database';
import { CartContext } from '@/context';

interface Props {
  product: IProduct;
}


const ProductPage: NextPage<Props> = ({ product }) => {

  // No se recomienda hacer paginas con el router por que no son SEO frienly. No son indexadas x los bot de Google.
  const router = useRouter();

  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectedSize = (size: ISize) => {
    // Supongamos que deseas actualizar el tamaño en tempCartProduct
    // Puedes hacerlo de la siguiente manera utilizando el operador spread (...) para crear una copia actualizada del objeto:
    setTempCartProduct(prevTempCartProduct => ({
      ...prevTempCartProduct,
      size, // Asigna el nuevo tamaño a la propiedad "size"
    }));
  }

  const onUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }));
  }
  const onAddProduct = () => {

    if( !tempCartProduct.size ) return;
    addProductToCart(tempCartProduct)
    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            {/* Title */}
            <Typography variant="h1" component='h1'>{product.title}</Typography>
            <Typography variant="subtitle1" >$ {product.price}</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Quantity</Typography>
              <ItemCounter 
                currentValue={ tempCartProduct.quantity }
                updatedQuantity={ onUpdateQuantity  }
                maxValue={ product.inStock > 10 ? 10: product.inStock }
              />
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={selectedSize}
              />
            </Box>

            {/* Agregar al carrito */}
            {
              product.inStock === 0
                ? (<Chip label='Out of stock' color="error" variant="outlined" />)
                : (
                  <Button
                    color="secondary"
                    className="circular-btn"
                    onClick={ () =>  onAddProduct() }
                  >
                    {
                      tempCartProduct.size
                        ? 'Add to cart'
                        : 'Select a size'
                    }
                  </Button>
                )
            }

            {/* Description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>


          </Box>
        </Grid>

      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// No usar SSR.... no es optimo renderizar la data en el server cada vez q se cargue la pagina.
/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string };

  const product = await dbProducts.getProductBySlug( slug );

  if( !product ){
    return {
        redirect: {
            destination: '/',
            permanent: false, //Indica a los bot que esta pagina nunca mas se debe indexar: permanent: true
        }
    }
}

  return {
    props: {
      product
    }
  }
}

 */

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const productSlugs = await dbProducts.getAllProductsSlugs();

  // console.log(productSlugs) => productSlugs: { slug: string }

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: {
        slug
      }
    }))
    ,
    fallback: "blocking"
  }
};


// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false, //Indica a los bot que esta pagina nunca mas se debe indexar: permanent: true
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}
export default ProductPage