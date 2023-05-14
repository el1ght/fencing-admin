import { mongooseConnect } from "@/lib/mongoose";
import { Subscription } from "@/models/Subscription";

export default async function handler(req, res) {
    await mongooseConnect();
    res.json(await Subscription.find().sort({createdAt: -1}));
};
