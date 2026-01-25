import Joi from 'joi';

const createTransactionSchema = Joi.object({
    transaction_note: Joi.string().allow('', null).optional(),
    transaction_amount: Joi.number().min(1).required(),
    transaction_type: Joi.string().valid('income', 'expense', 'transfer').required(),
    transaction_date: Joi.date().required(),
    category_id: Joi.number().required(),
    account_id: Joi.number().required(),
    // destination_account_id is required only when transaction_type is 'transfer'
    destination_account_id: Joi.number().when('transaction_type', {
        is: 'transfer',
        then: Joi.required(),
        otherwise: Joi.optional().allow(null)
    })
});

export {
    createTransactionSchema
};
