require('dotenv').config()

/** mongodb (atlas) url to connect db */
const url =  process.env.DB_URL;

/** exporting mongodb configuration to manifest */
module.exports = {
  url,
  settings: {
    poolSize: 10,
    useUnifiedTopology: true
  },
  decorate: true
};