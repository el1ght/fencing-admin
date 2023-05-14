const { Schema, model, models, default: mongoose } = require("mongoose");

const TournamentSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    date: {type: String},
    images: [{type: String}],
    category: {type:mongoose.Types.ObjectId, ref: 'Category'},
    properties: {type:Object},
}, {
    timestamps: true,
});

export const Tournament = models.Tournament || model('Tournament', TournamentSchema);