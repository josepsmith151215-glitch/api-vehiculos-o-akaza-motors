import 'dotenv/config';
import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true'
  }
};

let poolCache = null;

export async function obtenerConexion() {
  try {
    if (!poolCache) {
      poolCache = await sql.connect(config);
      console.log('✅ Conexión exitosa a la base de datos remota en Somee');
    }
    return poolCache;
  } catch (error) {
    console.error('❌ Error al conectar con Somee:', error.message);
    throw error;
  }
}

export { sql };
