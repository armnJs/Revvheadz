import sql from 'mssql';
import 'dotenv/config';


const sqlConfig = {
server: process.env.SQL_SERVER,
database: process.env.SQL_DATABASE,
user: process.env.SQL_USER,
password: process.env.SQL_PASSWORD,
options: {
encrypt: process.env.SQL_ENCRYPT === 'true',
trustServerCertificate: true
}
};


let pool;
export async function getPool() {
if (pool) return pool;
pool = await sql.connect(sqlConfig);
return pool;
}
export { sql };