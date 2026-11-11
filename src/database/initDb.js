import { obtenerConexion } from './conexion.js';

async function initDatabase() {
  try {
    console.log('⏳ Intentando conectar con el servidor remoto de Somee...');
    const pool = await obtenerConexion();
    console.log('⏳ Verificando la tabla Vehiculos...');
    
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vehiculos]') AND type in (N'U'))
      BEGIN
          CREATE TABLE Vehiculos (
              id INT IDENTITY(1,1) PRIMARY KEY,
              placaVeh VARCHAR(15),
              idMarca INT,
              descripVehiculo VARCHAR(100),
              anioFabVeh INT,
              propietarioVeh VARCHAR(100),
              imagenVeh VARCHAR(255)
          );
      END
    `);

    console.log('✅ Tabla Vehiculos configurada con éxito en Somee.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error configurando la tabla:', error.message);
    process.exit(1);
  }
}

initDatabase();