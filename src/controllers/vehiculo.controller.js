import { obtenerConexion, sql } from '../database/conexion.js';

let schemaReady = false;

async function asegurarColumnaMarca(pool) {
  if (schemaReady) return true;
  try {
    await pool.request().query(`
      IF COL_LENGTH('Vehiculos', 'marcaPersonalizada') IS NULL
      BEGIN
        ALTER TABLE Vehiculos ADD marcaPersonalizada VARCHAR(80) NULL;
      END
    `);
    schemaReady = true;
    return true;
  } catch {
    const check = await pool.request().query("SELECT COL_LENGTH('Vehiculos', 'marcaPersonalizada') AS len");
    schemaReady = check.recordset[0]?.len !== null;
    return schemaReady;
  }
}

export const getVehiculos = async (req, res) => {
  try {
    const pool = await obtenerConexion();
    await asegurarColumnaMarca(pool);
    const result = await pool.request().query('SELECT * FROM Vehiculos ORDER BY id DESC');
    return res.json(result.recordset);
  } catch (error) {
    console.error('Error en SELECT:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getVehiculoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const pool = await obtenerConexion();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Vehiculos WHERE id = @id');

    if (!result.recordset.length) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createVehiculo = async (req, res) => {
  try {
    const placa = (req.body.placaVeh || req.body.placa || '').toString().trim().toUpperCase().slice(0, 15);
    const descripcion = (req.body.descripVehiculo || req.body.descripcion || '').toString().trim().slice(0, 100);
    const anio = parseInt(req.body.anioFabVeh || req.body.anio, 10) || 2024;
    const idMarca = parseInt(req.body.idMarca, 10) || 1;
    const propietario = (req.body.propietarioVeh || req.body.propietario || '').toString().trim().slice(0, 100);
    const imagen = (req.body.imagenVeh || req.body.imagen || '').toString().trim().slice(0, 255) || null;
    const marcaCustom = idMarca === 6
      ? ((req.body.marcaPersonalizada || req.body.nombreMarca || '').toString().trim().toUpperCase().slice(0, 80) || null)
      : null;

    if (!placa || !descripcion) {
      return res.status(400).json({ error: 'Placa y descripción son obligatorias' });
    }

    const pool = await obtenerConexion();
    const tieneColMarca = await asegurarColumnaMarca(pool);

    const request = pool.request()
      .input('placaVeh', sql.VarChar(15), placa)
      .input('idMarca', sql.Int, idMarca)
      .input('descripVehiculo', sql.VarChar(100), descripcion)
      .input('anioFabVeh', sql.Int, anio)
      .input('propietarioVeh', sql.VarChar(100), propietario || 'Sin Propietario')
      .input('imagenVeh', sql.VarChar(255), imagen);

    if (tieneColMarca) {
      request.input('marcaPersonalizada', sql.VarChar(80), marcaCustom);
      await request.query(`
        INSERT INTO Vehiculos (placaVeh, idMarca, descripVehiculo, anioFabVeh, propietarioVeh, imagenVeh, marcaPersonalizada)
        VALUES (@placaVeh, @idMarca, @descripVehiculo, @anioFabVeh, @propietarioVeh, @imagenVeh, @marcaPersonalizada)
      `);
    } else {
      await request.query(`
        INSERT INTO Vehiculos (placaVeh, idMarca, descripVehiculo, anioFabVeh, propietarioVeh, imagenVeh)
        VALUES (@placaVeh, @idMarca, @descripVehiculo, @anioFabVeh, @propietarioVeh, @imagenVeh)
      `);
    }

    return res.status(201).json({ mensaje: 'Vehículo guardado correctamente' });
  } catch (error) {
    console.error('Error en INSERT:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
export const updateVehiculo = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const placa = (req.body.placaVeh || req.body.placa || '').toString().trim().toUpperCase().slice(0, 15);
    const descripcion = (req.body.descripVehiculo || req.body.descripcion || '').toString().trim().slice(0, 100);
    const anio = parseInt(req.body.anioFabVeh || req.body.anio, 10) || 2024;
    const idMarca = parseInt(req.body.idMarca, 10) || 1;
    const propietario = (req.body.propietarioVeh || req.body.propietario || '').toString().trim().slice(0, 100);
    const imagen = (req.body.imagenVeh || req.body.imagen || '').toString().trim().slice(0, 255) || null;
    const marcaCustom = idMarca === 6
      ? ((req.body.marcaPersonalizada || req.body.nombreMarca || '').toString().trim().toUpperCase().slice(0, 80) || null)
      : null;

    if (!placa || !descripcion) {
      return res.status(400).json({ error: 'Placa y descripción son obligatorias' });
    }

    const pool = await obtenerConexion();
    const tieneColMarca = await asegurarColumnaMarca(pool);

    const request = pool.request()
      .input('id', sql.Int, id)
      .input('placaVeh', sql.VarChar(15), placa)
      .input('idMarca', sql.Int, idMarca)
      .input('descripVehiculo', sql.VarChar(100), descripcion)
      .input('anioFabVeh', sql.Int, anio)
      .input('propietarioVeh', sql.VarChar(100), propietario || 'Sin Propietario')
      .input('imagenVeh', sql.VarChar(255), imagen);

    let result;
    if (tieneColMarca) {
      request.input('marcaPersonalizada', sql.VarChar(80), marcaCustom);
      result = await request.query(`
        UPDATE Vehiculos
        SET placaVeh = @placaVeh,
            idMarca = @idMarca,
            descripVehiculo = @descripVehiculo,
            anioFabVeh = @anioFabVeh,
            propietarioVeh = @propietarioVeh,
            imagenVeh = @imagenVeh,
            marcaPersonalizada = @marcaPersonalizada
        WHERE id = @id
      `);
    } else {
      result = await request.query(`
        UPDATE Vehiculos
        SET placaVeh = @placaVeh,
            idMarca = @idMarca,
            descripVehiculo = @descripVehiculo,
            anioFabVeh = @anioFabVeh,
            propietarioVeh = @propietarioVeh,
            imagenVeh = @imagenVeh
        WHERE id = @id
      `);
    }

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    return res.json({ mensaje: 'Vehículo actualizado correctamente' });
  } catch (error) {
    console.error('Error en UPDATE:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteVehiculo = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const pool = await obtenerConexion();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Vehiculos WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    return res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
