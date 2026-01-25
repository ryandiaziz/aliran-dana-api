import Joi from 'joi';

const createTransferSchema = Joi.object({
    source_account_id: Joi.number().required(),
    destination_account_id: Joi.number().required().invalid(Joi.ref('source_account_id')).messages({
        'any.invalid': 'Destination account must be different from source account'
    }),
    amount: Joi.number().min(1).required(),
    admin_fee: Joi.number().min(0).optional().default(0),
    note: Joi.string().allow('', null).optional(),
    transaction_date: Joi.date().required(),
    category_id: Joi.number().required() // User needs to specify 'Transfer' category ID usually
});

export {
    createTransferSchema
};
