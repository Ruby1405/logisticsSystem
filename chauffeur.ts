import * as mongoose from 'mongoose';

const chauffeurSchema = new mongoose.Schema({
    workerId: Number,
    name: String,
    schedule: [
        {
            start: Date,
            end: Date
        }
    ]
});

export const Chauffeur = mongoose.model('Chauffeur', chauffeurSchema);