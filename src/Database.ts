import mongoose from 'mongoose';
import logger from './shared/Logger';

const dsn = process.env.MONGOOSE_URL as string;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.set('useCreateIndex', true);
mongoose.connect(dsn, options)
  .then(() => {
    logger.info('connected to mongo server at: ' + dsn);
  })
  .catch(error => {
  logger.info('Failed to connect to the Mongo server!!');
  console.log(error);
});

export default mongoose;
