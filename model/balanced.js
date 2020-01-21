const mongoose  = require('mongoose');

const balancedSchema  = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    message:{
        type: String,
        default: 'success'
    },
    attempts: {
            type: Number,
            required: true,
            default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Balanced = mongoose.model('balanced', balancedSchema);

module.exports = Balanced;