import { Firebase ,fetchData,upLoadData} from "../../firebase";
import { useEffect,useState } from "react";
import Style from "./index.module.css";
import { Emailer, Emailer2 } from "../../emailjs";

const Form = () => {
  const [dataList,setDataList] = useState(null)
  const [selectedIndex,setSelectedIndex] = useState(null)
  const [email,setEmail] = useState(null)
  useEffect( ()=>{
   const Fdata = async () =>{

   let data =  await fetchData();

   data.map(item=>{
    console.log(item)

   })
   setDataList(data);
   }
   Fdata();
   let email_data ={"to_email":"rahulwork120@gmail.com","to_name":"testing rahul"};
  //  Emailer2();
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
    const imageFile = e.target.files;
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
    <div className={Style.maindiv}>
      <form  onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
        {/* <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" /> */}
        <input type="file" onChange={handleImageChange} accept="image/png, image/gif, image/jpeg"  multiple />
        <button type="submit">Submit</button>
      </form>
      <ul className={Style.div2}>
        {dataList!=null? dataList.map((item,index) => (
            <li key={index}> 
            <div className={Style.divs}>

                <div>Name: {item.name}</div> 
                {/* <br /> */}
                {/* <div>Email: {item.email}</div>  */}
                <br />
              
                <img src={item.imageUrl} alt="Uploaded" /> 
                <br />
                <input type="email" placeholder="enter your email to know the details" style={{width:"90%",marginTop:"10px",marginBottom:"10px"}} onChange={(e)=>{setEmail(e.target.value);console.log(email)}} />
                <br />
                <input type="button" value="Get in touch" onClick={()=>{
                  console.log(dataList[index]);
                  let image = dataList[index]["imageUrl"][0];
                  Emailer({...dataList[index],"image":image,"to_email":email})
                }} />
                <br />
            </div>
           </li> 
          )):"Loading"}
      </ul>
    </div>
  );
        }
export default Form;
