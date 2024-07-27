export default (): any => ({
  database: {
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT ? parseInt(process.env.TYPEORM_PORT, 10) : undefined,
    user: process.env.TYPEORM_USERNAME,
    pass: process.env.TYPEORM_PASSWORD,
    name: process.env.TYPEORM_DB_NAME,
  },
  session: {
    secretKey: String(process.env.JWT_SECRET_KEY),
    jwtTokenExpiration: 604800, // 1 semana
  },
});
