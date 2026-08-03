export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  database: {
    url: process.env.DATABASE_URL || 'mysql://bairral_user:bairral_pass@localhost:3306/bairral_canal_etica',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
});
