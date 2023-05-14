import { Tournament } from "@/models/Tournament";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Tournament.findOne({_id:req.query.id}))
        } else {
            res.json(await Tournament.find());
        }
    }

    if (method === 'POST') {
        const {title, description, date, images, category, properties} = req.body;
        const tournamentDoc = await Tournament.create({
            title, description, date, images, category, properties,
        })
        res.json(tournamentDoc);
    }

    if (method === 'PUT') {
        const {title, description, date, images, category, properties, _id} = req.body;
        await Tournament.updateOne({_id}, {title, description, date, images, category, properties});
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Tournament.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}