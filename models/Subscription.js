const { Schema, models, model } = require("mongoose");

const SubscriptionSchema = new Schema({
    line_items: Object,
    email: String,
}, {
    timestamps: true,
});

export const Subscription = models?.Subscription || model('Subscription', SubscriptionSchema);