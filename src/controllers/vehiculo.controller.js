import { obtenerConexion, sql } from '../database/conexion.js';

export const getVehiculos = async (req, res) => {
  try {
    const pool = await obtenerConexion();
    const result = await pool.request().query('SELECT * FROM Vehiculos ORDER BY id DESC');
    res.status(200).json({ success: true, total: result.recordset.length, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al consultar vehículos', error: error.message });
  }
};

export const getVehiculoById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await obtenerConexion();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Vehiculos WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al buscar el vehículo', error: error.message });
  }
};

export const createVehiculo = async (req, res) => {
  const { placaVeh, idMarca, descripVehiculo, anioFabVeh, propietarioVeh, imagenVeh } = req.body;

  if (!placaVeh || !descripVehiculo) {
    return res.status(400).json({ success: false, message: 'La placa y la descripción son obligatorias' });
  }

  try {
    const pool = await obtenerConexion();
    await pool.request()
      .input('placaVeh', sql.VarChar(15), placaVeh)
      .input('idMarca', sql.Int, idMarca || 1)
      .input('descripVehiculo', sql.VarChar(100), descripVehiculo)
      .input('anioFabVeh', sql.Int, anioFabVeh)
      .input('propietarioVeh', sql.VarChar(100), propietarioVeh)
      .input('imagenVeh', sql.VarChar(255), imagenVeh || null)
      .query(`
        INSERT INTO Vehiculos (placaVeh, idMarca, descripVehiculo, anioFabVeh, propietarioVeh, imagenVeh)
        VALUES (@placaVeh, @idMarca, @descripVehiculo, @anioFabVeh, @propietarioVeh, @imagenVeh)
      `);

    res.status(201).json({ success: true, message: 'Vehículo registrado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear el vehículo', error: error.message });
  }
};

export const updateVehiculo = async (req, res) => {
  const { id } = req.params;
  const { placaVeh, idMarca, descripVehiculo, anioFabVeh, propietarioVeh, imagenVeh } = req.body;

  try {
    const pool = await obtenerConexion();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('placaVeh', sql.VarChar(15), placaVeh)
      .input('idMarca', sql.Int, idMarca)
      .input('descripVehiculo', sql.VarChar(100), descripVehiculo)
      .input('anioFabVeh', sql.Int, anioFabVeh)
      .input('propietarioVeh', sql.VarChar(100), propietarioVeh)
      .input('imagenVeh', sql.VarChar(255), imagenVeh)
      .query(`
        UPDATE Vehiculos 
        SET placaVeh = @placaVeh, idMarca = @idMarca, descripVehiculo = @descripVehiculo, 
            anioFabVeh = @anioFabVeh, propietarioVeh = @propietarioVeh, imagenVeh = @imagenVeh
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado para actualizar' });
    }

    res.status(200).json({ success: true, message: 'Vehículo actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el vehículo', error: error.message });
  }
};

export const deleteVehiculo = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await obtenerConexion();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Vehiculos WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado para eliminar' });
    }

    res.status(200).json({ success: true, message: 'Vehículo eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el vehículo', error: error.message });
  }
};