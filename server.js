const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
app.get(['/estado', '/estado.html'], (req, res) => res.redirect('/servidor.html'));
app.use(express.json());
app.use(express.static(__dirname));

const dbConfig = {
    user: process.env.DB_USER || 'akaza_admin',
    password: process.env.DB_PASSWORD || 'TuPassword123',
    server: process.env.DB_SERVER || 'sql.somee.com',
    database: process.env.DB_DATABASE || 'gestionvehicularakaza',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.get('/api/vehiculos', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM vehiculos');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/vehiculos', async (req, res) => {
    try {
        const { placa, descripcion, anio, idMarca, propietario } = req.body;
        let pool = await sql.connect(dbConfig);
        
        await pool.request()
            .input('placa', sql.VarChar, placa)
            .input('descripcion', sql.VarChar, descripcion)
            .input('anio', sql.Int, anio)
            .input('idMarca', sql.Int, idMarca)
            .input('propietario', sql.VarChar, propietario)
            .query(`INSERT INTO vehiculos (placa_vehiculo, descripcion_vehiculo, anio_fabricacion, id_marca, propietario) 
                    VALUES (@placa, @descripcion, @anio, @idMarca, @propietario)`);

        res.json({ mensaje: 'Vehículo guardado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
