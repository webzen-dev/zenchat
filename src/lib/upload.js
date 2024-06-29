import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const upload = async (file) => {
  const storageRef = ref(storage, file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is puased");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },

      (error) => {
        //   console.log(error.message);
        reject("Somthing went wrong !" + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((download) => {
          // console.log("Fil`e available at ", download);
          resolve(download);
        });
      }
    );
  });
};
export default upload;
