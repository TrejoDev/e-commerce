import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
// import { getSession } from 'next-auth/react';

import { authOptions } from '../auth/[...nextauth]';
import { IOrder } from '@/interfaces';
import { db } from '@/database';
import { Order, Product } from '@/models';

type Data = 
| { message: string } 
| IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'POST':
            return createOrder( req, res );
    
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;    //El body de la orden. Validar siempre nuestra orden contra el backend, xq esta puede ser modificada desde el cliente malentensionadamente

    // Verificar que tengamos un usuario
    const session: any = await getServerSession(req, res, authOptions); //En la request con Axios carga las Cookies y en las cookies va la info del usuario.
    if( !session ){
        return res.status(401).json({ message: 'You must be authenticated to do this' });
    }
    // Crear un arreglo con los items q la persona va a llevar
    const productsIds = orderItems.map( item => item._id ); //[ ids ] prodectos en el cart
    await db.connect();

    const dbProducts = await Product.find({ _id: { $in: productsIds } });  //Genera un [] con los productos en mi db que el id coincide con los que estan en eñ cart

    try {
        const subTotal = orderItems.reduce( (acc, current) => {
            const currentPrice = dbProducts.find( (prod) => prod.id === current._id, )?.price;
            if( !currentPrice ){ 
                throw new Error('Check the cart again, the product does not exist')
            }
            return (current.price * current.quantity) + acc 
        }, 0);

        const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );
        const backendTotal = subTotal * ( taxRate + 1 );

        if( total !== backendTotal ){
            throw new Error('The Total does not match the amount')
        }

        // todo: all fine at this point
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round( newOrder.total * 100 ) / 100;
        await newOrder.save();
        await db.disconnect();

        return res.status(201).json( newOrder );
        
    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: error.message || 'Check server logs'
        })
    }
}
