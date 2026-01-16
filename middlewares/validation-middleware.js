import Response from '../helpers/response-helper.js'; // Pastikan path ini benar

const validate = (schema, source = 'body') => (req, res, next) => {
    // source bisa 'body', 'params', atau 'query'
    const { error } = schema.validate(req[source], { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json(Response.failed(`Validasi gagal: ${errorMessages.join(', ')}`));
    }
    next();
};

export default validate;