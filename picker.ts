import * as mongoose from 'mongoose';

const pickerSchema = new mongoose.Schema({
    workerId: Number,
    name: String,
    schedule: [Date]
});

export const Picker = mongoose.model('Picker', pickerSchema);