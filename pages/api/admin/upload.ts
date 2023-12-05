import type { NextApiRequest, NextApiResponse } from 'next'
// import formidable from 'formidable';
import { IncomingForm, File } from 'formidable';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data = {
    message: string
}

export const config = {  //Configuracion para decirle a Next que no serialice las imagenes. //con esto no parsea el body
    api: {
        bodyParser: false
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'POST':
            return uploadFile( req, res );
    
        default:
            return res.status(400).json({ message: 'Bad request' });
    }

    res.status(200).json({ message: 'Example' })
}

const saveFile =async (file: File ): Promise<string> => {
    // const data = fs.readFileSync( file.filepath );
    // fs.writeFileSync(`./public/${ file.originalFilename }`, data);
    // fs.unlinkSync( file.filepath ); // elimina
    // return;

    const { secure_url } = await cloudinary.uploader.upload( file.filepath );

    return secure_url;
}

const parseFiles = async(req: NextApiRequest): Promise<string> => {

    return new Promise( (resolve, reject) => {

        const form = new IncomingForm(); //* Preparamos el objeto de formidable para analizar el formulario que estamos manadando o lo que viene en la request.

        form.parse( req, async( err, fields, files ) => {
            console.log({ files });

            if ( err ) {
                return reject(err);
            }

            const filePath = await saveFile( files.file![0] as File )
            resolve(filePath);
        })

    }) 

}

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const imageUrl = await parseFiles(req);

    return res.status(200).json({ message: imageUrl })
}
