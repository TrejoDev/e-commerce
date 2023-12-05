import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import { disconnect } from 'process';

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts( req, res );

        case 'PUT':
            return updateProduct( req, res );

        case 'POST':
            return createProduct( req, res );
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
    
    
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();

    const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();
    await db.disconnect();

    // todo: tendremos que actualizar las imagenes 
    const updateProducts = products.map( product => {
        product.images = product?.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        } )
        return product;
    } )

    return res.status(200).json( updateProducts );
}
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body;

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'The product is not valid' });
    }

    if( images.length < 2 ){
        return res.status(400).json({ message: 'At least two images are necessary.' });
    }

    // todo: posiblemente tangamos un mal formato en el query de las imagenes   

    try {
        await db.connect();
        const product = await Product.findById( _id );

        if( !product ){
            await db.disconnect();
            return res.status(400).json({ message: 'There is no product with that ID' });
        }
        // image.lastIndexOf('/') => marca la posicion del ultimo "/"          // split('.') => marca la posicion despues del punto de extension
        // https://res.cloudinary.com/dprbwh11g/image/upload/v1701270385/b3akpqzgd33zkceexop5.png

        // todo: eliminar fotos de Cloudinary
        product.images.forEach( async( image ) => {
            if( !images.includes( image ) ){
                // Borrar imagen de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1).split('.');
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        } )

        await product.updateOne( req.body )
        await db.disconnect();

        return res.status(200).json( product );
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Check the server console' });
    }

}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if( images.length < 2 ){
        return res.status(400).json({ message: 'At least two images are necessary.' });
    }

    // todo: posiblemente tangamos un mal formato en el query de las imagenes 

    try {
        await db.connect();
        const productInDb = await Product.findOne({ slug: req.body.slug });
        if( productInDb ){
            return res.status(400).json({ message: 'There is already a product with that slug.' });
            await db.disconnect();
        }
        const product = new Product( req.body );
        await product.save();

        await db.disconnect();
        return res.status(201).json( product );
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Check the server console' });
    }
}

