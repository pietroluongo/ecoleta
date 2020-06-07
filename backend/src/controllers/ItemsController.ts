import knex from '../db/connection'
import {Request, Response} from 'express';

import settings from '../settings';

class ItemsController {

    async index(req: Request, res: Response) {
        const items = await knex('items').select('*');

        const serialized_items = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://${settings.server_address}:${settings.server_port}/uploads/${item.image}`,
            };
        });

        return res.json(serialized_items);
    }

}

export default ItemsController;
