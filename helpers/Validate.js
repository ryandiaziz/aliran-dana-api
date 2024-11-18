class Validate {
    static valueId(value, name = 'value') {
        if (value === undefined || value === null) throw new Error(`${name} : undefined or not found.`);
        if (isNaN(value)) throw new Error(`invalid ${name} : ${value}`);
        if (typeof value === 'string' || value instanceof String) throw new Error(`TypeError ${name}: Expected input type is 'boolean', but '${typeof value}' was received.`);

        if (value === 0) return false;
        if (value < 0) throw new Error(`invalid ${name} : ${value}`);
        return value;
    }

    static valueString({ value, name = 'value', isOpt = false }) {
        if (value === undefined || value === null) {
            if (isOpt) return false;
            else throw new Error(`${name} : undefined or not found!`);
        } else if (value.trim() === '' || value === 'all') return false;
        else return value;
    }

    static valueBoolean({value, name = 'value'}) {
        if (value === undefined || value === null)
            throw new Error(`${name} : undefined or not found.`);

        if (typeof value !== 'boolean')
            throw new Error(`TypeError ${name}: Expected input type is 'boolean', but '${typeof value}' was received.`);

        return value;
    }
}

export default Validate;