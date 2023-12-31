import type { NextApiRequest, NextApiResponse } from 'next'
import { connect } from '../../../database/db';
import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';

type Data = 
    | { message: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return searchProduct( req, res );      
    
        default:
            res.status(400).json({ message: 'Bad request' })
    }

}

const searchProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    let { q = '' } = req.query;


    if( q.length === 0 ){
        return res.status(400).json({
            message: 'You must specify the search query'
        })
    }

    q = q.toString().toLocaleLowerCase();

    await db.connect();

    const products = await Product.find({
        $text: { $search: q }
    })  .select( 'title images price inStock slug -_id' )
        .lean();

    await db.disconnect();

    return res.status(200).json( products )
}
