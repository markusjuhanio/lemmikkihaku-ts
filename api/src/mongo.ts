import mongoose from 'mongoose';
import { logger } from './logger';

const useMongo = async (uri: string | undefined): Promise<void> => {
  logger.info(`Connecting to ${uri}`);
  try {
    await mongoose.connect(uri || '');
    logger.info('Connected to MongoDB');
  } catch (error: any) {
    logger.error(`Error connecting to database: ${error.message}`);
  }
};

export default useMongo;