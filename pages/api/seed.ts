import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/database';
import { Order, Product, User} from '@/models';
import { initialData } from '@/database/seed-data';

type Data = {
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if( process.env.NODE_ENV === 'production' ){
        return res.status(401).json({
          message: 'Don`t access to this service'
        })
      }

      await db.connect();

      await User.deleteMany();
      await User.insertMany( initialData.user );

      await Product.deleteMany();   
      await Product.insertMany( initialData.products );
      
      await Order.deleteMany();
      
      await db.disconnect();


    res.status(200).json({
         message: 'Successful request',
        })
}