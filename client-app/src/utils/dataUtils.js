export function handleInputData(event, data, setData) {
    setData({
        ...data,
        [event.target.name]: event.target.value
    });
}

export function handleInputDate(date, data, setData, name) {
    setData({
        ...data,
        [name]: date !== null ? new Date(date.year(), date.month(), date.date() + 1, 0, 0, 0, 0) : null
    });
}

export function handleInputSelect(value, data, setData, name) {
    setData({
        ...data,
        [name]: value
    });
}

export function handleInputNumber(value, data, setData, name) {
    setData({
        ...data,
        [name]: value
    });
}

export function ConvertToOptions(list, label, value) {
    return list.map(item => ({
        label: item[label],
        value: item[value]
    }));
}

export function GetKeyObject(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function ConvertToInt(value) {
    value = parseInt(value)
    return !isNaN(value) ? value : null;
}

export function ConvertToFloat(value) {
    value = parseFloat(value)
    return !isNaN(value) ? value : null;
}