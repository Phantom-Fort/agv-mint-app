// src/utils/logger.js

// Log levels for filtering
const LOG_LEVELS = {
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

// Get log level based on environment
const getLogLevel = () => {
  return process.env.NODE_ENV === 'development' ? LOG_LEVELS.debug : LOG_LEVELS.info;
};

// Format log message with timestamp and metadata
const formatLogMessage = (message, type, metadata = {}) => {
  const timestamp = new Date().toLocaleString();
  return {
    timestamp,
    message,
    type,
    ...metadata,
  };
};

// Console logging utility
const consoleLog = (level, message, metadata = {}) => {
  const currentLevel = getLogLevel();
  if (LOG_LEVELS[level] <= currentLevel) {
    const formattedMessage = `[${level.toUpperCase()}] ${message} ${JSON.stringify(metadata)}`;
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }
};

// Logger utility to integrate with AppContext
export const logger = {
  error: (message, metadata = {}) => {
    consoleLog('error', message, metadata);
    return formatLogMessage(message, 'error', metadata); // For ActivityLog
  },
  warn: (message, metadata = {}) => {
    consoleLog('warn', message, metadata);
    return formatLogMessage(message, 'warn', metadata);
  },
  info: (message, metadata = {}) => {
    consoleLog('info', message, metadata);
    return formatLogMessage(message, 'info', metadata);
  },
  debug: (message, metadata = {}) => {
    consoleLog('debug', message, metadata);
    return formatLogMessage(message, 'debug', metadata);
  },
};

// Example usage:
// import { logger } from '../utils/logger';
// logger.info('Wallet connected', { wallet: '0x123...' });
// logger.error('Minting failed', { error: 'Insufficient funds', chainId: 56 });