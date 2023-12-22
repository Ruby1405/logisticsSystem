import * as mongoose from 'mongoose';

const pickerSchema = new mongoose.Schema({
    workerId: Number,
    name: String,
    schedule: [
        {
            start: Date,
            end: Date,
            wareHouse: Number
        }
    ]
});

export const Picker = mongoose.model('Picker', pickerSchema);