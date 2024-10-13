import Validate from "./Validate.js";

class Parser {
    static parserTransactionFilters(body) {
        return {
            user_id: Validate.valueIdSearch(body.user_id, 'user id'),
            account_id: Validate.valueIdSearch(body.account_id, 'account id'),
            category_id: Validate.valueIdSearch(body.category_id, 'category id'),
            transaction_note: Validate.valueStringSearch(body.transaction_note, 'transaction note'),
            transaction_type: Validate.valueStringSearch(body.transaction_type, 'transaction type'),
            transaction_date: Validate.valueStringSearch(body.transaction_date, 'transaction date')
        }
    }
}

export default Parser;