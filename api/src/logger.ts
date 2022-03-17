import pino from 'pino';
import expressPino from 'express-pino-logger';

export const logger = pino({
  transport: {
    target: 'pino-pretty'
  },
  redact: {
    paths: ['*.headers.authorization']
  }
});

export const expressLogger = expressPino({
  logger: logger, serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  }
});
