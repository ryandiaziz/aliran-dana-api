import Validate from "./validateHelper.js";

class Parser {
    static parserTransactionFilters(body) {
        return {
            user_id: Validate.valueId(body.user_id, 'user_id'),
            account_id: Validate.valueId(body.account_id, 'account_id'),
            category_id: Validate.valueId(body.category_id, 'category_id'),
            is_relative_date_enabled: Validate.valueBoolean({
                value: body.is_relative_date_enabled,
                name: 'transaction type'
            }),
            transaction_note: Validate.valueString({
                value: body.transaction_note,
                name: 'transaction_note'
            }),
            transaction_type: Validate.valueString({
                value: body.transaction_type,
                name: 'transaction_type'
            }),
            transaction_date_from: Validate.valueString({
                value: body.transaction_date_from,
                name: 'transaction_date_from'
            }),
            transaction_date_to: Validate.valueString({
                value: body.transaction_date_to,
                name: 'transaction_date_to',
                isOpt: true
            })
        }
    }

    static excludeFieldsFromArray(dataArray, fieldsToExclude = []) {
        if (!Array.isArray(dataArray)) {
            throw new Error('Input harus berupa array');
        }

        return dataArray.map(item => Parser.excludeFields(item, fieldsToExclude));
    }

    static excludeFields(data, fieldsToExclude = []) {
        if (typeof data !== 'object' || data === null) {
            throw new Error('Input harus berupa objek');
        }

        const result = { ...data };
        for (const field of fieldsToExclude) {
            delete result[field];
        }

        return result;
    }
}

export default Parser;