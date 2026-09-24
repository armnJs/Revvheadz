import { Router } from 'express';
import multer from 'multer';
import { getPool, sql } from '../db.js';
import fs from 'fs';
import path from 'path';


const router = Router();
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);


const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, uploadDir),
filename: (req, file, cb) => {
const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
cb(null, unique + '-' + file.originalname);
}
});
const upload = multer({ storage });


// Upload file for vehicle
router.post('/:vehicleId', upload.single('file'), async (req,res)=>{
try {
const pool = await getPool();
const result = await pool.request()
.input('VehicleId', sql.Int, req.params.vehicleId)
.input('FileName', sql.NVarChar(255), req.file.originalname)
.input('FilePath', sql.NVarChar(500), `/uploads/${req.file.filename}`)
.query(`INSERT INTO dbo.VehicleFiles (VehicleId, FileName, FilePath)
OUTPUT inserted.*
VALUES (@VehicleId, @FileName, @FilePath)`);
res.json(result.recordset[0]);
} catch(e){ res.status(500).json({ error: e.message }); }
});


// Get files for vehicle
router.get('/:vehicleId', async (req,res)=>{
try {
const pool = await getPool();
const result = await pool.request()
.input('VehicleId', sql.Int, req.params.vehicleId)
.query('SELECT * FROM dbo.VehicleFiles WHERE VehicleId=@VehicleId ORDER BY UploadedAt DESC');
res.json(result.recordset);
} catch(e){ res.status(500).json({ error: e.message }); }
});


export default router;