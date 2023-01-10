const express = require ('express');
const bodyParser   = require ('body-Parser');
const mysql = require ('mysql');
const app = express ();
const PORT = 1922 ;

app.use  (bodyParser.json());
app.use  (bodyParser.urlencoded({extended :true}));

const koneksi = mysql.createConnection ({
    host: "localhost",//host server ex: localhost
    user: "root",//username database ex : port
    password: "",// password database ex : 123456
    database: "client", //nama databse ex : nama_database
    
});

koneksi.connect(function(err) {
    !err
     ?console.log('berhasil koneksi database')
     :console.log('gagal koneksi database');
});

// endpoint api
//endpoint api
//req=menerima data
//res=mengirim data
//app wadah untuk mengirim (res)

app.post("/api/simpan_data", function (req, res) {
    const { id_sales, nama, pj, alamat , alamat_ktp, provinsi} = req.body;
    koneksi.query(
        `INSERT into sys_client (id_sales, nama,pj, alamat , alamat_ktp, provinsi)
         values ('${id_sales}', '${nama}', '${pj}','${alamat}','${alamat_ktp}','${provinsi}')`,
        [],
        (err, result) => {
            if (!err) {
                console.log("berhasil simpan data");
                res.json({
                    status: 200,
                    message:"berhasil simpan data",
                    data_dari_fe: req.body
                });
            } else {
                console.log("gagal simpan data");
                console.log(err);
                //untuk memberikan respon pada frontend
                res.json({
                    status: 500,
                    message:"Gagal simpan data",
                    data_dari_fe: req.body
                });
            }
        }
    );
    console.log(req.body)
    
});

//endpoint api from frontend
app.get("/api/tampil_data", function (req, res) {
       koneksi.query
        (`SELECT * FROM sys_client`,[] ,(err, result) => {
            if (!err) {
                console.log("berhasil menampilkan data");
                res.json({
                    status: 200,
                    message:"berhasil menampilkan data",
                    data: result,
                });
            } else {
                console.log("gagal simpan data");
                console.log(err);
                //untuk memberikan respon pada frontend
                res.json({
                    status: 500,
                    message:"Gagal menampilkan data",
                    
                });
            }
        });
    });

    app.put("/api/update_data/:id", function (req, res){
        // buat variable penampung daata dan query sql
        const data = {...req.body};
        const querysearch = 'SELECT * FROM sys_client where id=?';
        const queryupdate = 'UPDATE sys_client SET ? where id =?';
    
    
        // jalankan query untuk menampilkan data
        koneksi.query (querysearch , req.params.id, (err,rows, field) =>{
            console.log(req.params.id);
            //error handling
            if (err) {
                return res.status(500).json({message :'ada kesalahan',error:'error'});
            }
    
            //jika id yang dimasukan sesuai dengan data bd
            if (rows.length){
                //jalankan query update
                koneksi.query(queryupdate, [data, req.params.id], (err, rows, field) =>{
                    
                    //error handling
                    if (rows.err){
                        return res.status(500).json({message :'ada kesalahan', error:'error'});
                    }
    
                    //jika update berhasil
                    res.status(200).json({succes:true, message :'berhasil update data!'});
                });
            }else{
                return res.status(404).json({message:'data tidak ditemukan',succes: false});
            }
        });
     });

     app.delete('/api/hapus_data/:id', (req, res) => {
        // buat query sql untuk mencari data dan hapus
        const querySearch = 'SELECT * FROM sys_client WHERE id = ?';
        const queryDelete = 'DELETE FROM sys_client WHERE id = ?';
    
        // jalankan query untuk melakukan pencarian data
        koneksi.query(querySearch, req.params.id, (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Ada kesalahan', error: err });
            }
    
            // jika id yang dimasukkan sesuai dengan data yang ada di db
            if (rows.length) {
                // jalankan query delete
                koneksi.query(queryDelete, req.params.id, (err, rows, field) => {
                    // error handling
                    if (err) {
                        return res.status(500).json({ message: 'Ada kesalahan', error: err });
                    }
    
                    // jika delete berhasil
                    res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
                });
            } else {
                return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
            }
        });
    });
    




app.listen(PORT,
     () =>{ console.log ('berhasil menjalankan server')
    });




