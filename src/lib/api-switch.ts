// Automatic API switching based on environment
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Choose API implementation based on environment
let apiService;

if (isProduction && isVercel) {
  // Use Vercel API for production
  apiService = require('./api-vercel').apiService;
} else {
  // Use local JSON Server for development
  apiService = require('./api').apiService;
}

export { apiService };
