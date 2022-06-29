import Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown){
    try{
        const prismic = Prismic.client(
            process.env.PRISMIC_ENDPOINT, 
            {
                req,
                accessToken: process.env.PRISMIC_ACCESS_TOKEN 
            }
        );
        return prismic;
    }catch(err){
        console.log('ERRO', err);
    }
    


    
}