import * as mongoose from 'mongoose';

const logisticsSystemConfigSchema = new mongoose.Schema({
    nextWorkerId: Number,
    nextProductId: Number
});

export const LogisticsSystemConfig = mongoose.model('LogisticsSystemConfig', logisticsSystemConfigSchema);