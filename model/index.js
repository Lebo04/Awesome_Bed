//----- Import database connection from the config folder
let db = require('../config');
//----- Import bcrypt module
let { hash, compare, hashSync } = require('bcrypt');
