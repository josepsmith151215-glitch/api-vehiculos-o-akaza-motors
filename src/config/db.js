import sql from 'mssql';

export const dbConfig = {
  user: process.env.DB_USER || 'gestionvehicularakaza',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'gestionvehicularakaza.mssql.somee.com',
  database: process.env.DB_NAME || 'gestionvehicularakaza',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export default dbConfig;
