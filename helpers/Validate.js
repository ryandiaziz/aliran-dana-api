class Validate{
    static valueIdSearch(value, name = 'value'){
        if (value === undefined || value === null) throw new Error(`${name} : undefined or not found!`);
        if (isNaN(value)) throw new Error(`invalid ${name} : ${value}`);
        if (typeof value === 'string' || value instanceof String)
            if (value.trim() === '') return false;

        const valueInt = parseInt(value);        
        if (valueInt === 0) return false;
        if (valueInt < 0) throw new Error(`invalid ${name} : ${value}`);
        return valueInt;
    }

    static valueStringSearch(value, name = 'value'){
        if (value === undefined || value === null) throw new Error(`${name} : undefined or not found!`);
        else if (value.trim() === '' || value === 'all') return false;
        else return value;
    }
}

export default Validate;