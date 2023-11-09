import STDash from "@/components/STDash";
import AdminDash from "@/components/AdminDash";
import Futter from "@/components/futter";
import HeadderX from "@/components/headerx";
import FacultyX from "@/components/dashboard/FacultyX";
import {Field, Form, Formik} from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";



export default ()=>{

    const [getfile,setfilex] = useState();
    const [progressX,setprogressX] = useState();
    const [xdat,setxdat] = useState([]);


    function loaddata() {
        axios.get("/api/admin/mat").then(value => {


            setxdat(value.data);

            console.log(value.data);

        })

    }

useEffect(()=>{


    loaddata();
},[])

    async function hadlser(d) {
        const file = d.currentTarget.files[0];


        let f = new FormData()
        f.append("file", file);
        try {
            const Response = await axios.post("/api/upload", f,{

                onUploadProgress(r){
                  setprogressX(  r.progress);
                }
            });

            if (Response) {

               setfilex(Response.data.name)

                toast("added")
            }


        } catch (err) {
            console.log(err);
        }


    }


    return   <div style={{backgroundColor:"lightslategrey"}}>    <HeadderX/>

        <div className="d-flex">
            <AdminDash/>
            <div className="d-flex w-100 justify-content-center container text-center mt-2" style={{backgroundColor:"lightslategrey"}}>

                <div className="w-100">

                    <h3 className="p-3 rounded w-100" style={{backgroundColor:"#013571",color:"white"}}> Manage Course Materials </h3>

                    <Formik initialValues={{
                        title:"",
                        link:null
                    }} onSubmit={async (fe) => {

                        console.log(fe.toString());


                    }}>


                        <form id="xrt" className="">

                            <textarea name="title" id="rtfile"   placeholder="Title.........." className="form-control mt-3 h-25">

                            </textarea>



                            <input type="file"  className="mt-2 form-control w-50" onChange={hadlser}>
                            </input>
                            <br/>


                            <div className="d-flex justify-content-center text-center">
                            <div className="w-75 position-relative" onClick={
                                async event => {

                                    if (progressX==1) {


                                        const Response = await axios.post("/api/admin/mat", {
                                            title: document.getElementById("rtfile").value,
                                            link: getfile, // Assuming getfile is defined elsewhere
                                        });
                                        const form = document.getElementById("xrt");
                                        form.reset();
                                        loaddata()
                                    }
                                }
                            }>
                                {progressX >0 ?<div className="rounded bg-warning position-absolute btn h-100" style={{width:`${(progressX*100)}%`}}><p className="text-white"> {progressX==1?"Add New Item":progressX *100+"%"} </p></div>:""}
                            <button type="submit" className="btn  w-100 bg-transparent" >.</button>
                            </div>
                            </div>
                        </form>

                    </Formik>




                    <ul className="list-group mb-5 mt-2 ">
                        {xdat.map((item) => (
                            <li key={item._id} className="list-group-item d-flex justify-content-between">
                                {item.title}

                                <button
                                    onClick={() => {

                                        toast.promise(axios.delete(`/api/admin/mat?id=${item._id}`), {
                                            loading: 'deleting...',
                                            success: <b>deleted</b>,
                                            error: <b>Could not deleted.</b>,
                                        }).then(()=>

                                        {

loaddata()
                                        }
                                        )




                                    }}
                                    className="btn btn-danger btn-sm float-right"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                </div>



            </div>



        </div>



        <Futter/>




    </div>
}