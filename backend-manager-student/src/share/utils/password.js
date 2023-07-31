//! LIBRARY
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//! SHARE
const REGEX = require('../configs/regex');
const CONSTANTS = require('../configs/constants');
const CONFIGS = require('../configs/config');

module.exports = {
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} password
     * @created_at 22/01/2022
     * @description validate full password can return data
     * @returns {boolean}
     */
    isValidPassword(password) {
        // Must be 8 characters or more long
        if (password.length < 8) {
            return false;
        }
        // Check character UpperCase LowerCase
        let hasUpperCase = false;
        let hasLowerCase = false;
        for (let i = 0; i < password.length; i++) {
            if (password[i] === password[i].toUpperCase()) {
                hasUpperCase = true;
            }
            if (password[i] === password[i].toLowerCase()) {
                hasLowerCase = true;
            }
            if (hasUpperCase && hasLowerCase) {
                break;
            }
        }
        if (!hasUpperCase || !hasLowerCase) {
            return false;
        }

        // Check number and character
        let hasNumber = false;
        let hasSpecialChar = false;
        const specialChars = REGEX.REGEX_CHARACTER;
        for (let i = 0; i < password.length; i++) {
            if (!isNaN(password[i])) {
                hasNumber = true;
            }
            if (specialChars.indexOf(password[i]) !== -1) {
                hasSpecialChar = true;
            }
            if (hasNumber && hasSpecialChar) {
                break;
            }
        }
        if (!hasNumber || !hasSpecialChar) {
            return false;
        }

        // Check not character
        const invalidChars = REGEX.REGEX_NOT_CHARACTER;
        for (let i = 0; i < password.length; i++) {
            if (invalidChars.indexOf(password[i]) !== -1) {
                return false;
            }
        }

        return true;
    },
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} password
     * @created_at 22/01/2022
     * @description validate full password regex
     * @returns {boolean}
     */
    isPassword(password) {
        // Must be 8 characters or more long
        const password_length = password.length < 8;

        if (password_length) {
            return false;
        }
        const reg = new RegExp(REGEX.REGEX_PASSWORD).test(password);
        return reg;
    },
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} password
     * @created_at 01/02/2022
     * @description encode password
     * @returns {boolean}
     */
    encodePassword: (password) => bcrypt.hash(password, CONSTANTS.SALT_ROUNDS),
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} password
     * @created_at 01/02/2022
     * @description compare password
     * @returns {boolean}
     */
    comparePassword: (password, password_hash) => bcrypt.compare(password, password_hash),
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} password
     * @created_at 23/02/2023
     * @description Reset Password
     * @returns {String}
     */
    resetStringToken() {
        return crypto.randomBytes(CONSTANTS.CRYPTO_TOKEN).toString(CONSTANTS.CRYPTO_TYPE);
    },
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} password
     * @created_at 24/02/2023
     * @description Reset Password
     * @returns {String}
     */
    randomPubPriKey() {
        const { privateKey, publicKey } = crypto.generateKeyPairSync(CONFIGS.GENERAL_KEY_RANDOM, {
            modulusLength: Number(CONFIGS.MODULUSLENGTH),
        });
        const all_key = {
            privateKey,
            publicKey,
        };
        return all_key;
    },
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} public_key
     * @created_at 25/02/2023
     * @description Encode Pem Public Key
     * @returns {String}
     */
    encodePemPubKey(public_key) {
        return public_key
            .export({
                type: CONFIGS.TYPE_PEM,
                format: CONFIGS.ENCODE_PEM,
            })
            .toString();
    },
    /**
     * @author Nguyễn Tiến Tài
     * @param {string} public_key
     * @created_at 24/02/2023
     * @description decode pem key
     * @returns {String}
     */
    decodePemPubKey(public_key) {
        return crypto.createPublicKey({
            key: public_key,
            type: CONFIGS.TYPE_PEM,
            format: CONFIGS.ENCODE_PEM,
        });
    },
};
