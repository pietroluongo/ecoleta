import {Request, Response, response} from 'express';
import knex from '../db/connection'

class PointsController {

    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query;
        const parsed_items = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        console.log()
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsed_items)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
        return res.json(points);
    }

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

        // TODO: Remover imagem Placeholder
        const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: 'https://images.unsplash.com/photo-1591189327425-aa5f21c7ab2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=20',
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

        await trx.commit();

        return res.json({
            id: point_id,
            ...point
        });
    }
}

export default PointsController;