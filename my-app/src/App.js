import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";


function App() {


  useEffect(() => {
    axios.get('http://localhost:3000/list')
      .then(response => setdelete(response.data))
      .catch(error => console.log(error));
  }, []);


  const [deleted, setdelete] = useState([]);
  const [selected, setselect] = useState(null);
  const [file, setFile] = useState(null);
  function handleFileChange(e) {
    console.log(e.target.files);
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  let handleselectChange = (e) => {
    setselect(e.target.value)

  }

  function deletus() {
    axios.post("http://localhost:3000/delete", { "key": selected })
      .then(response => {
        console.log(response.data)
        window.location.reload();
      })
      .catch(error => {
        toast.error(error.response.data.message)
        console.log(error)
      })

  }

  function upload() {
    const formData = new FormData();
    formData.append('file', file);
    axios.post('http://localhost:3000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data);
      window.location.reload();
    })
      .catch(error => console.log(error));
  }
  console.log(selected)
  return (
    <div className="App">

      <p>Click on the "Choose File" button to upload a file:</p>
      <input type="file" id="myfile" name="name" onChange={handleFileChange}></input>
      <button onClick={upload}>upload </button>
      <p>Click on the "Delete File" button to delete a file:</p>

      <select onChange={handleselectChange}>
        <option value="⬇️ Select a file ⬇️"> -- Select a file -- </option>

        {deleted.map((deleted) => <option value={deleted}>{deleted}</option>)}
      </select>
      <button onClick={deletus}>Delete </button>

    </div>



  );
}

export default App;
