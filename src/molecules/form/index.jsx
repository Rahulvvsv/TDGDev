import { Firebase ,fetchData,upLoadData} from "../../firebase";
import { useEffect,useState } from "react";
import Style from "./index.module.css"
const Form = () => {
  const [dataList,setDataList] = useState(null)
  useEffect( ()=>{
   const Fdata = async () =>{

   let data =  await fetchData();

   data.map(item=>{
    console.log(item)

   })
   setDataList(data);
   }
   Fdata();
  },[])
  const [formData, setFormData] = useState({ name: '', email: '', age: '', image: null });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: imageFile
    }));
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        upLoadData(formData);
  };

//   const handleDelete = async (id) => {
//     try {
//       // Delete data from Firebase Firestore
//       await deleteDoc(doc(db, 'formData', id));
//       console.log('Document deleted with ID: ', id);
//     } catch (error) {
//       console.error('Error deleting document: ', error);
//     }
//   };

  return (
    <div>
      <form  onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
        <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" />
        <input type="file" onChange={handleImageChange} accept="image/png, image/gif, image/jpeg"   />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {dataList!=null? dataList.map((item) => (
            <li key={item.id}> 
            <div className={Style.divs}>

                <div>Name: {item.name}</div> 
                <div>Email: {item.email}</div> 
                <div>Age:  {item.age}</div> 
                <img src={item.imageUrl} alt="Uploaded" /> 
            </div>
           </li> 
          )):""}
      </ul>
    </div>
  );
        }
export default Form;
