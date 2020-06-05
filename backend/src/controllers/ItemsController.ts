import knex from '../db/connection'
import {Request, Response} from 'express';

const server_address = '192.168.0.13';

class ItemsController {

    async index(req: Request, res: Response) {
        const items = await knex('items').select('*');

        const serialized_items = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://${server_address}:3333/uploads/${item.image}`,
            };
        });

        return res.json(serialized_items);
    }

}

export default ItemsController;
