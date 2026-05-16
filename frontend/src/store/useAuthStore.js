import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set)=>({
    authUser : null,
    isCheckingAuth : true,
    isSigningUp : false,
    isLoggingIn : false,

    checkAuth : async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser : res.data})
        } catch (error) {
            console.log("Error in authCheck :", error);
            set({authUser: null});
        } finally{
            set({isCheckingAuth : false});
        }
    },

    signup : async (data) =>{
        try {
            set({isSigningUp: true})
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser : res.data})
            
            //toast notification
            toast.success("Account Created Successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isSigningUp: false})
        }
    },

    login : async (data) => {
        try {
            set({isLoggingIn : true});
            const res = await axiosInstance.post("/auth/login" , data);
            set({authUser : res.data});
            toast.success("Logged In SuccessFully")
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn : false});
        }
    },

    logout : async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser :null});
            toast.success("Logged Out SuccessFully!!");
        } catch (error) {
            toast.error("Error while Logging out!!")
            console.log("Logout Error : ",error);
        }
    }
}));







// export const useAuthStore = create((set)=>({
//     authUser : { name : "Jane", _id : 123, age : 21}, 
//     isLoggedIn : false,
//     isLoading : false,

//     login: () => {
//         console.log("We just logged In");
//         set({isLoggedIn : true, isLoading : true});     
//     }
// }));