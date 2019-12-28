BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "TipoSensor" (
	"IdTipoMedida"	INTEGER NOT NULL,
	"Descripcion"	TEXT NOT NULL,
	PRIMARY KEY("IdTipoMedida")
);
CREATE TABLE IF NOT EXISTS "Direcciones" (
	"IdDireccion"	INT,
	"IdUsuario"	INT,
	"DirecionOrigen"	STRING NOT NULL,
	"DireccionDestino"	STRING NOT NULL,
	FOREIGN KEY("IdUsuario") REFERENCES "Usuarios"("IdUsuario"),
	PRIMARY KEY("IdDireccion")
);
CREATE TABLE IF NOT EXISTS "Estados" (
	"IdEstado"	INTEGER,
	"Descripcion"	TEXT,
	PRIMARY KEY("IdEstado")
);
CREATE TABLE "Sensor" (
	"IdSensor"	INTEGER NOT NULL,
	"IdTipoMedida"	INTEGER NOT NULL,
	"IdEstado"	INTEGER NOT NULL,
	"FactorCalibracion"	REAL NOT NULL,
	FOREIGN KEY("IdTipoMedida") REFERENCES "TipoSensor"("IdTipoMedida"),
	FOREIGN KEY("IdEstado") REFERENCES "Estados"("IdEstado"),
	PRIMARY KEY("IdSensor")
);
CREATE TABLE IF NOT EXISTS "Usuarios" (
	"IdUsuario"	INTEGER NOT NULL UNIQUE,
	"Email"	TEXT UNIQUE,
	"Password"	TEXT NOT NULL,
	"Nombre"	STRING(50),
	"Telefono"	INTEGER,
	"TipoUsuario"	STRING(20) NOT NULL,
	PRIMARY KEY("IdUsuario" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Estaciones" (
	"ID"	INTEGER,
	"Provincia"	CHAR(100),
	"Municipio"	CHAR(100),
	"Nombre"	CHAR(150),
	"Latitud"	DECIMAL,
	"Longitud"	DECIMAL,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Medidas" (
	"IdMedida"	INTEGER NOT NULL UNIQUE,
	"IdTipoMedida"	INTEGER,
	"IdUsuario"	INTEGER,
	"Valor"	DOUBLE NOT NULL,
	"Tiempo"	DATE,
	"Latitud"	DOUBLE,
	"Longitud"	DOUBLE,
	FOREIGN KEY("IdTipoMedida") REFERENCES "TipoSensor"("IdTipoMedida"),
	FOREIGN KEY("IdUsuario") REFERENCES "Usuarios"("IdUsuario"),
	PRIMARY KEY("IdMedida" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "UsuarioSensor" (
	"IdUsuario"	INTEGER NOT NULL UNIQUE,
	"IdSensor"	INTEGER NOT NULL UNIQUE,
	FOREIGN KEY("IdUsuario") REFERENCES "Usuarios"("IdUsuario") ON DELETE CASCADE,
	FOREIGN KEY("IdSensor") REFERENCES "Sensor"("IdSensor") ON DELETE CASCADE,
	PRIMARY KEY("IdSensor","IdUsuario")
);
COMMIT;
