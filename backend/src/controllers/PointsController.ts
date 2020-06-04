import {Request, Response} from 'express';
import knex from '../db/connection'

class PointsController {

    async show(req: Request, res: Response) {
        const { id } = req.params;

        // Como o ID é único, dá pra usar o .first() aqui
        const point = await knex('points').where('id', id).first();
        if(!point) {
            return res.status(400).json({message: 'Point not found.'});
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({point, items});

    }

    async create(req: Request, res: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        // trx = transaction - Evita ter problemas quando uma das queries é
        // executada e a outra não, o que criaria inconsistência no DB
        const trx = await knex.transaction();


        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: 'none',
        };

        // knex.insert retorna um array de ids dos objetos inseridos. Como
        // um único objeto foi inserido, então o ids[0] é o id desse objeto.
        const inserted_ids = await trx('points').insert(point);


        const point_id = inserted_ids[0];

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            };
        })


        await trx('point_items').insert(pointItems);

        return res.json({
            id: point_id,
            ...point
        });
    }
}

export default PointsController;