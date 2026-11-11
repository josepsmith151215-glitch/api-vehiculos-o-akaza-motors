-- Ejecutar esto en SQL Server Management Studio (SSMS) o Azure Data Studio
CREATE DATABASE VehiculosDB;
GO
USE VehiculosDB;
GO
CREATE TABLE Vehiculos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    placaVeh VARCHAR(15),
    idMarca INT,
    descripVehiculo VARCHAR(100),
    anioFabVeh INT,
    propietarioVeh VARCHAR(100),
    imagenVeh VARCHAR(255)
);
GO
