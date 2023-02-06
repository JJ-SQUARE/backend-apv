const idGenerator = () => {
    return Math.random().toString(32).substring(2) + Date.now().toString(32)
};

export default idGenerator;

// .random() Genera el número random
// .toString(32) amplia las posibilidades del random
// .substring(2); elimina los dos primeros caracteres