import { useState,useEffect } from "react";
import axios from "axios";
import { stat } from "fs";
import Logo from '@/LOGO-BIN.png';
import Image from 'next/image';
import Head from 'next/head';

 
const koneksiUas = axios.create({ 
  baseURL: "http://127.0.0.1:5000/api/uas" 
});

export default function FormUas() {
  const [statenama, setNama] = useState("");
  const [statenik, setNik] = useState("");
  const [statetanggal, setTanggal] = useState("2018-07-22");
  const [statekasus, setKasus] = useState("");
  const [statefoto, setFoto] = useState("");
  const [uas, setUas] =  useState(null);

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;

    return [year, month, day].join('-');
  }
   
  const handleSubmitAdd =  (event) => {  
    event.preventDefault();
    const formData = new FormData(event.target);
    koneksiUas
      .post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      .then((res) => {
        console.log(res);
        window.location.reload();
      })

      .catch((err) => {
        console.log(err);
      });
  }

  const handleSubmitEdit =  (event) => {
    event.preventDefault();
    const address = "/"+event.target.nik.value;
  
    const formData = {
      nik: event.target.nik.value,
      nama: event.target.nama.value,
      kasus: event.target.kasus.value,
      tanggal_lahir: event.target.tanggal_lahir.value
    }
  koneksiUas
    .put( address,formData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    }); 
  }

  const handleCancelEdit = (event) => {  
    setNama("");
    setNik("");
    setKasus("");
    setTanggal(formatDate("2018-07-22"));
    setFoto("");
  }

  const handleDelete = (event) => {
    event.preventDefault();
    var nik = event.target.value;
    koneksiUas.delete(`/${nik}`)
      .then(response => {
        console.log('Data berhasil dihapus:', response.data);
        window.location.reload();
        setUas(
          uas.filter((uas) => {
            return uas.nik !== nik;
          })
        )
      })
      
      .catch(error => {
        console.error('Gagal menghapus data:', error);
      })
  }

  const handleEdit = (event) => {
    event.preventDefault();
    var nik = event.target.value;

    document.getElementById("formedit").style.display = "inline"

    const uasEdit =  uas.filter((uas) => {
      return uas.nik == nik;
    });
    
    if(uasEdit!=null){
      setNama(uasEdit[0].nama);
      setNik(uasEdit[0].nik);
      setKasus(uasEdit[0].kasus);
      setTanggal(formatDate(uasEdit[0].tanggal_lahir));
      setFoto(uasEdit[0].foto);
    }
  }

  const batalEdit = (event) => {
    document.getElementById("formedit").style.display = "none";
  }

  useEffect(() => {
    async function getUas() {
      const response = await koneksiUas.get("/").then(function (axiosResponse) {
        setUas(axiosResponse.data.data);
      })
        
      .catch(function (error) {   
        alert('error from uas in api uas: '+error);
      });
    }
    
    getUas();
  }, []);

  const tambahData = (event) => {
    document.getElementById("formadd").style.display = "inline";
  }

  const bataltambahdata = (event) => {
    document.getElementById("formadd").style.display = "none";
  }

if(uas==null){
  return(
    <div>
      waiting...
    </div>
  )
}else{
  return (
    <div className="container-home"> 
    <Head>
      <title>DPO BIN</title>
    </Head>
      <center>
        <div className="atas-home">
          <div className="header-home">
            <h1>DAFTAR PENCARIAN ORANG</h1>
            <Image src={Logo} width={200} height={200} className="logo" />
          </div>
          <ul>
            <li><input type="button" value="Tambah Data" onClick={tambahData} className="tambahdata-home" /></li>
            <li><input type="button" value="Batal" onClick={bataltambahdata} className="tambahdata-home" /></li>
          </ul>
        <form id="formadd" onSubmit={handleSubmitAdd} style={{display: "none"}} >
          <table border={0}>
            <tbody>
              
              <tr>
                <td><label> Nik:</label></td>
                <td><input type="text" id="nik" name="nik" /></td>
              </tr>
              
              <tr>
                <td><label> Nama:</label></td>
                <td><input type="text" id="nama" name="nama" /></td>
              </tr>
          
              <tr>
                <td><label> Foto:</label></td>
                <td><input type="file" name="image"/></td>
              </tr>
          
              <tr>
                <td><label> Tanggal Lahir:</label></td>
                <td><input type="date" name="tanggal_lahir" min="1930-01-01" max="2025-12-31"/></td>
              </tr>
          
              <tr>
                <td><label> Kasus:</label></td>
                <td><textarea id="text" style={{resize: "none"}} name="kasus"></textarea></td>
              </tr>
            
            </tbody>
          </table>
          <input type="submit" className="tambah-home" value="Kirim"/>
        </form>  
        
        <form id="formedit" onSubmit={handleSubmitEdit} style={{display: "none"}}> 
          <table border={0}>
            <tbody>
              
              <tr>
                <td><label> Nik:</label></td>
                <td><input type="text" id="nik" value={statenik} name="nik"/></td>
              </tr>
          
              <tr>
                <td><label> Nama:</label></td>
                <td><input type="text" id="nama" value={statenama} name="nama" onChange={(e) => setNama(e.target.value)} /></td>
              </tr>
              
              <tr>
                <td><label> Foto:</label></td>
                <td><img src={statefoto} width="80"/></td>
              </tr>
              
              <tr>
                <td><label> Tanggal Lahir:</label></td>
                <td><input type="date" value={statetanggal} name="tanggal_lahir" onChange={(e) => setTanggal(e.target.value)} min="1970-01-01" max="2025-12-31"/></td>
              </tr>
          
              <tr>
                <td><label> Kasus:</label></td>
                <td><textarea id="text" style={{resize: "none"}} value={statekasus} name="kasus"  onChange={(e) => setKasus(e.target.value)}></textarea></td>
              </tr>

            </tbody>
          </table>
          <input type="submit" className="tambah-home" value="Kirim"/>
          <input type="button" value="Batal" onClick={batalEdit} className="tambah-home" id="batal-edit-home"/>
        </form>  
      </div>
      <div className="bawah-home">
      
        <p>Daftar Target</p>
        <table border={2}>
          <thead>
            <tr>
              <td><b>Nik</b></td> 
              <td><b>Nama</b></td>
              <td><b>Foto</b></td>
              <td><b>Tanggal Lahir</b></td>
              <td><b>Kasus</b></td>
              <td colSpan={2}><b>Pengaturan</b></td>
            </tr>
          </thead>
          <tbody>
            {uas.map((uas) => 
              <tr>
                <td>{uas.nik}</td>
                <td>{uas.nama}</td>
                <td><img src={uas.foto} width="80"/></td>
                <td>{uas.tanggal_lahir}</td>
                <td>{uas.kasus}</td>
                <td><button onClick={handleEdit} value={uas.nik} className="edit-home-tabel">Ubah</button></td>
                <td><button onClick={handleDelete} value={uas.nik} className="delete-home-tabel">Hapus</button></td>
              </tr>
            )}     
          </tbody>
        </table>
      </div>
      </center>
    </div>
  )
}
}