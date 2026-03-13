const generateAccessCode = () => {
    return "DR-" + Math.floor(1000 + Math.random() * 9000);
};

module.exports = generateAccessCode;