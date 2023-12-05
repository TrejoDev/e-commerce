
import { GetServerSideProps, NextPage } from 'next'

import { Box, Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <>
      <ShopLayout title={"Teslo Shop - Search"} pageDescription={"Find the best product of teslo here"}>
        <Typography variant="h1" component='h1'>Search product</Typography>

        {
          foundProducts 
            ? <Typography variant="h2" sx={{ mb: 1 }} textTransform='capitalize'>Term: {query}</Typography>
            : (
              <Box display='flex'>
                <Typography variant="h2" sx={{ mb: 1 }}>Not found any products whit this term:</Typography>
                <Typography variant="h2" sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
                <Typography variant="h2" sx={{ ml: 1 }} >But you can see other products we have available:</Typography>
              </Box>
            )
        }

        <ProductList products={products} />


      </ShopLayout>
    </>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { query = '' } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  //no hay resultados a ese query
  let products = await dbProducts.getProductByTerm(query);
  const foundProducts = products.length > 0;

  // TODO: retornar otros productos
  if( !foundProducts ){
    // products = await dbProducts.getAllProducts();
    products = await dbProducts.getProductByTerm('shirt');  //Mandar ultimod terminos de busqueda almacenados en cookies
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    }
  }
}

export default SearchPage;