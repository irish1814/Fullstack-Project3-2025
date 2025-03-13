const loadData = (key) => JSON.parse(localStorage.getItem(key)) || {};
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export function getAll(key) {
    const data = loadData(key);
    return Object.values(data);
}

export function get(email) {
    const data = loadData(email);
    return data[email] || null;
}

export function add(key, email, entry) {
    if (!email) return { error: "Email is required" };

    const data = loadData(key);
    if (data[email]) return { error: "Entry already exists" };

    data[email] = entry;
    saveData(key, data);
    return entry;
}

export function update(key, email, newData) {
    const data = loadData(key);
    if (!data[email]) return { error: "Entry not found" };

    data[email] = { ...data[email], ...newData };
    saveData(key, data);
    return data[email];
}

export function remove(key, email) {
    const data = loadData(key);
    if (!data[email]) return { error: "Entry not found" };

    delete data[email];
    saveData(key, data);
    return { success: true };
}

