var isValidUsername = function (inputString) {
    if (!inputString) {
        return false;
    }

    for (const c of inputString) {
        if (!(c.charCodeAt()> 47 && c.charCodeAt()< 58) && // numeric (0-9)
            !(c.charCodeAt()> 64 && c.charCodeAt()< 91) && // upper alpha (A-Z)
            !(c.charCodeAt()> 96 && c.charCodeAt()< 123) && // lower alpha (a-z)
            !(c === '-' || c === '_')){
            return false;
        }
    }

    return true;
};

exports = module.exports = {isValidUsername};
