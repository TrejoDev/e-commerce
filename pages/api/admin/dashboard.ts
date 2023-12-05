import type { NextApiRequest, NextApiResponse } from 'next'
import { connect } from '../../../database/db';
import { db } from '@/database';
import { Order, Product, User } from '@/models';

type Data = {
        numberOfOrders: number;
        paidOrders: number; // isPaid: true
        notPaidOrders: number;
        numberOfClients: number; // role: clients
        numberOfProducts: number;
        productsWithNoInventory: number; //with 0
        lowInventory: number; //Productos con  10 o menos.
    }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.count(),
        Order.find({ isPaid: true }).count(),
        User.find({ role: 'client' }).count(),
        Product.count(),
        Product.find({ inStock: 0 }).count(),
        // $lte: less than equal: menor o igual
        Product.find({ inStock: { $lte: 10 } }).count(),
    ]);
    await db.disconnect();


   
    return res.status(200).json({ 
        numberOfOrders,
        paidOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
     });

}


