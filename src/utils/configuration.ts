// /* eslint-disable prettier/prettier */
import 'dotenv/config';

const CONFIG = {
  MONGO_USERNAME: process.env.MONGO_USERNAME as string,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD as string,
  MONGO_DATABASE: process.env.MONGO_DATABASE as string,
  MONGO_HOST: process.env.MONGO_HOST as string,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  PORT: parseInt(process.env.PORT as string, 10) || 3001,
};

export default (): Record<string, any> => ({
  MONGO_DATABASE: CONFIG.MONGO_DATABASE,
  MONGO_URI: `mongodb://${CONFIG.MONGO_USERNAME}:${CONFIG.MONGO_PASSWORD}@${CONFIG.MONGO_HOST}`,
  NODE_ENV: CONFIG.NODE_ENV,
  PORT: CONFIG.PORT,
  CORS_OPTIONS: {
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: '*',
  },
});
