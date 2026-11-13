import sql from 'mssql';

const dbConfig = {
  user: process.env.DB_USER || 'gestionvehicularakaza',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'gestionvehicularakaza.mssql.somee.com',
  database: process.env.DB_NAME || 'gestionvehicularakaza',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export async function obtenerConexion() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (error) {
    console.error('❌ Error de conexión en conexion.js:', error.message);
    throw error;
  }
}

export async function getConnection() {
  return await obtenerConexion();
}

export { sql };
