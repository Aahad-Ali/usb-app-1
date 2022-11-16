// import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import moment from "moment";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc ,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCSfPVoSFsdskHPv9qLwonKtaQKdy6o3_Y",
  authDomain: "facebook-with-database.firebaseapp.com",
  projectId: "facebook-with-database",
  storageBucket: "facebook-with-database.appspot.com",
  messagingSenderId: "287155094336",
  appId: "1:287155094336:web:cf93e76dc20a1c353f70a5",
  measurementId: "G-6D913L5E12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

function App() {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  //   const [editingId, seteditingId] = useState(null);
  //   const [editingText, setEditingText] = useState("");
  const [editing, setEditing] = useState({
    editingId: null,
    editingText: "",
  });

  // ==========================================================================================/

  useEffect(() => {
    // const getData = async () => {
    //   const querySnapshot = await getDocs(collection(db, "posts"));
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => $`, doc.data());

    //     setPosts((prev) => {
    //       let newArry = [...prev, doc.data()];

    //       return newArry;
    //     });
    //   });
    // };

    // getData();

    // ===================  realtime data ================================
    let unsubscribe = null;
    const getRealTimeData = () => {
      const q = query(collection(db, "posts"), orderBy("publishDate", "desc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });

        // setPosts((prev) => {
        //   let newArry = [...prev, doc.data()];

        //   return newArry;
        // });

        console.log("posts : ", posts);
        setPosts(posts);
      });
    };
    getRealTimeData();

    return () => {
      console.log("unsubscribe");
      unsubscribe();
    };
  }, []);

  // ========================================= save post ========================================================

  const savePost = async (e) => {
    e.preventDefault();
    console.log("postText", postText);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        text: postText,
        publishDate: serverTimestamp(),
        // publishDate: new Date().getTime(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // ========================== delete post function ==============================================

  const deletePost = async (postId) => {
    console.log("post id:", postId);

    await deleteDoc(doc(db, "posts", postId));
  };

  // ========================== update post function ==============================================

  const updatePost = async () => {
    // e.preventDefault();

    // console.log('update',e)

    // const washingtonRef = doc(db, "posts", editing.editingId);

    // Set the "capital" field of the city 'DC'
    await updateDoc(doc(db, "posts", editing.editingId), {
      text:  editing.editingText,
    });

    // await updateDoc(doc(db, "posts", editing.editingId), {
    //   text: editing.editingText
    // });
    setEditing({ 
      editingId: null, 
      editingText: ""
     });
  };

  // ========================== edit post function ==============================================

  //   const edit = (postId, text) => {

  //     // seteditingId(postId);
  //     // setEditingText(text);

  //     // const updateState = posts.map((eachItem) => {
  //     //   if (eachItem.id === eachPost?.id) {
  //     //     return { ...eachItem, editingId: !eachItem.editingId };
  //     //   } else {
  //     //     return eachItem;
  //     //   }
  //     // });
  //     // setPosts(updateState);
  //   };

  // ============================================================================================

  return (
    <div>
      <form action="#" onSubmit={savePost}>
        <textarea
          type="text"
          placeholder="What's in your mind"
          onChange={(e) => {
            setPostText(e.target.value);
          }}
        />
        <br />

        <button type="submit">Post</button>
      </form>
      <div>
        {posts.map((eachPost, i) => (
          <div key={i} className={"news"}>
            <h3>

              {(eachPost.id === editing.editingId) ? 

                <form onSubmit={updatePost}>
                  <input
                    id=""
                    type="text"
                    value={editing.editingText}
                    placeholder="edit post"
                    onChange={(e) => {
                      setEditing({ ...editing, editingText: e.target.value });
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-info"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Update
                  </button>
                </form>
              : 
                eachPost?.text
              }
            </h3>
            {/* <p>{eachPost.publishDate}</p> */}
            <p>
              {moment(
                eachPost?.publishDate?.seconds
                  ? eachPost?.publishDate?.seconds * 1000
                  : undefined
              ).format(" Do MMMM YYYY, h:mm:")}
            </p>
            <button
              className="btn btn-success mx-3"
              onClick={() => {
                deletePost(eachPost.id);
              }}
            >
              Delete
            </button>

            {(editing.editingId === eachPost?.id) ? null : 
              <button
                className="btn btn-primary mx-3"
                onClick={() => {

                  setEditing({
                    editingId: eachPost?.id,
                    editingText: eachPost?.text
                  })

                }}
              >Edit</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
