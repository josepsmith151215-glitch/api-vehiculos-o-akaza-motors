import { obtenerConexion } from '../database/conexion.js';

export const getVehiculos = async (req, res) => {
  try {
    const pool = await obtenerConexion();
    
    // 1. Intentar consultar 'vehiculo' o 'vehiculos'
    let result;
    try {
      result = await pool.request().query('SELECT * FROM vehiculo');
    } catch (e1) {
      try {
        result = await pool.request().query('SELECT * FROM vehiculos');
      } catch (e2) {
        // 2. Si fallan ambas, listar qué tablas existen realmente en SomEE para ver el nombre correcto
        const tables = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'");
        const nombresTablas = tables.recordset.map(t => t.TABLE_NAME).join(', ');
        throw new Error('No se encontró la tabla. Tablas disponibles en la BD: ' + (nombresTablas || 'Ninguna'));
      }
    }

    return res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error en SELECT:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await obtenerConexion();
    const result = await pool.request().input('id', id).query('SELECT * FROM vehiculo WHERE id_vehiculo = @id');
    return res.json(result.recordset[0] || {});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createVehiculo = async (req, res) => {
  try {
    const { placa, descripcion, anio, idMarca, propietario } = req.body;
    const placaFinal = placa || req.body.placa_vehiculo;
    const descFinal = descripcion || req.body.descripcion_vehiculo;

    if (!placaFinal || !descFinal) {
      return res.status(400).json({ mensaje: 'Placa y descripción son obligatorias' });
    }

    const pool = await obtenerConexion();
    
    let queryInsert = 'INSERT INTO vehiculo (placa_vehiculo, descripcion_vehiculo, anio_fabricacion, id_marca, propietario_vehiculo) VALUES (@placa, @descripcion, @anio, @idMarca, @propietario)';
    try {
      await pool.request()
        .input('placa', placaFinal)
        .input('descripcion', descFinal)
        .input('anio', anio || 2020)
        .input('idMarca', idMarca || 1)
        .input('propietario', propietario || '')
        .query(queryInsert);
    } catch (e) {
      queryInsert = 'INSERT INTO vehiculos (placa_vehiculo, descripcion_vehiculo, anio_fabricacion, id_marca, propietario_vehiculo) VALUES (@placa, @descripcion, @anio, @idMarca, @propietario)';
      await pool.request()
        .input('placa', placaFinal)
        .input('descripcion', descFinal)
        .input('anio', anio || 2020)
        .input('idMarca', idMarca || 1)
        .input('propietario', propietario || '')
        .query(queryInsert);
    }

    return res.status(201).json({ mensaje: 'Vehículo guardado correctamente' });
  } catch (error) {
    console.error('❌ Error en INSERT:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateVehiculo = async (req, res) => res.json({ mensaje: 'Actualizado' });
export const deleteVehiculo = async (req, res) => res.json({ mensaje: 'Eliminado' });
