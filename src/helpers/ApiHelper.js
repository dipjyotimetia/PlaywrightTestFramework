const axios = require('axios');
const logger = require('../config/logger')(__filename);

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/todos/1';
axios.defaults.headers.common.Authorization = '';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

class ApiHelper {
  getData = async () => {
    try {
      const response = await axios.get('/posts?userId=1');
      logger.info(response);
    } catch (error) {
      logger.error(error);
    }
  };

  postData = async () => {
    try {
      const response = await axios.post('/posts');
      logger.info(response);
    } catch (error) {
      logger.error(error);
    }
  };
}

module.exports = ApiHelper;
