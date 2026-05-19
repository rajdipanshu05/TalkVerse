import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client"

export const useAuthStore = create((set,get)=>({
    authUser : null,
    isCheckingAuth : true,
    isSigningUp : false,
    isLoggingIn : false,
    socket : null,
    onlineUsers:[],

    checkAuth : async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser : res.data})
            get().connectSocket();
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
            get().connectSocket();
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
            get().connectSocket();
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
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error while Logging out!!")
            console.log("Logout Error : ",error);
        }
    },

    updateProfile : async (data)=>{
        try{
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({authUser : res.data});
            toast.success("Profile Updated Successfully!!")
        } catch( error){
            console.log("Error in update Profile : ", error);
            toast.error(error.response.data.message);
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return
        const socket = io("http://localhost:3000",{
            withCredentials : true //this ensures cookies are sent with connection
        })
        set({socket : socket})

        //listen for online users event
        socket.on("getOnlineUsers" , (userIds) => {
            set({onlineUsers : userIds});
        });
    },

    disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket.disconnect();
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