import {atomWithStorage } from "jotai/utils"
import { db, storage, auth } from "../../../firebase"
import { collection, addDoc, query, where, getDocs, getDoc, updateDoc, doc, DocumentData, QueryDocumentSnapshot, deleteDoc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { arrayUnion } from "firebase/firestore"
import { v4 } from "uuid";
import { getAuth, deleteUser, updatePassword, updateEmail, reauthenticateWithCredential} from "firebase/auth";
import { signInWithPopup, reauthenticateWithPopup, GoogleAuthProvider } from "firebase/auth";

export const userAtom = atomWithStorage("user", {
    username: "",
    userId: "",
    language: "",
    isOrganization: false,
    organizationId: "",
    organizationName: "",
    docOrganizationId: ""
})

// array of dictionaries
export const modulesAtom = atomWithStorage("modules", [] as any[])

// array of dictionaries
export const assignmentsAtom = atomWithStorage("assigmnents", [] as any[])

// selected assignment
export const selectedAssignmentAtom = atomWithStorage("selectedAssi", [] as any)

// ===================== Helper functions for data manipulation =====================
export function sortIdDictionary (dictionary:any) {
    var items = dictionary.map((item:any, index:number) => {
        return [index, item["id"]]
    })    

    items.sort((first:any, second:any) => {
        return first[1] - second[1]
    })

    var result = []
    for (var i = 0; i < items.length; i++) {
        result.push(dictionary[items[i][0]])
    }

    return result  
}

export function didCompletedAssi (userId:string, assignmentDict:any) {
    var usersComp:any[] = []
    assignmentDict.usersCompleted.forEach((value:string, index:number) => {
        usersComp.push(value.split(" ")[0])
    })
    return usersComp.includes(userId)
}

export function sortAssignmentsByType (dictionary:any, userId:string, filterDidFinish:boolean = true) {
    var items = dictionary.map((item:any, index:number) => {
        return [index, item.moduleId]
    })    

    items.sort((first:any, second:any) => {
        return second[1] - first[1]
    })

    let result = []
    for (let i = 0; i < items.length; i++) {
        const it = dictionary[items[i][0]]
        if (filterDidFinish && !didCompletedAssi(userId, it)) {
            result.push(it)
        } 
        else if (!filterDidFinish) result.push(it)
    }

    return result  
}

export function sortAssignmentsByDate (dictionary:any, userId:string, filterDidFinish:boolean = true) {
    var items = dictionary.map((item:any, index:number) => {
        return [index, new Date(item.date)]
    })    

    items.sort((first:any, second:any) => {
        return second[1] - first[1]
    })

    var result = []
    for (var i = 0; i < items.length; i++) {
        const it = dictionary[items[i][0]]
        if (filterDidFinish && !didCompletedAssi(userId, it)) {
            result.push(it)
        } 
        else if (!filterDidFinish) result.push(it)
    }

    return result  
}

function makeid(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


// ===================== User auth functions =====================
export async function initOrganization (username:string, userId:string, organization:string, language:string) {
    // create organizaton
    const length = (await getDocs(collection(db, "organizations"))).size
    var ouid = length.toString()
    ouid += makeid(5-ouid.length)

    const doc = await addDoc(collection(db, "organizations"), {
        owner: username,
        ownerId: userId,
        name: organization,
        users: [userId],
        language: language,
        id: ouid
    })

    // create user that created the organization as well
    const userInfo = {
        username: username,
        userId: userId,
        language: language,
        isOrganization: true,
        organizationId: ouid,
        organizationName: organization,
        docOrganizationId: doc.id
    }

    await addDoc(collection(db, "users"), userInfo)

    return userInfo
}



export async function initUser (username:string, userId:string, docID:string) {
    // update organization users 
    await updateDoc(doc(collection(db, "organizations"), docID), {
        users: arrayUnion(userId)
    })

    const document = await getDoc(doc(collection(db, "organizations"), docID))
    if (!document || !document.data()) return ""

    // initialize user info
    const info = {
        username: username,
        userId: userId,
        isOrganization: false,
        language: document.data()!.language,
        organizationId: document.data()!.id,
        organizationName: document.data()!.name,
        docOrganizationId: docID
    }

    await addDoc(collection(db, "users"), info)

    return info
}

// Retrieve information about the user from the firebase dataset; when we login
export async function getUser (username:string) { 
    var q = query(collection(db, "users"), where("username", "==", username))

    var data = {
        username: "",
        userId: "",
        language: "",
        isOrganization: false,
        organizationId: "",
        organizationName: "",
        docOrganizationId: ""
    }

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc:any) => {
        data = doc.data()
    })

    // get language of organization 
    const q2 = doc(collection(db, "organizations"), data.docOrganizationId) 
    const result = await getDoc(q2)
    var lang = result.data()!.language
    data.language = lang
    
    return data as any
}


// ===================== Assignments / Module functions =====================
export async function organizationExists (organizationId:string) {
    const q = query(collection(db, "organizations"), where("id", "==", organizationId)) 
    const querySnapshot = await getDocs(q)
    if (querySnapshot.size == 1) {
        var ret = "" 
        querySnapshot.forEach((doc:any) => {
            ret = doc.id 
        })
        return ret
    } else return ""
}

// add to assignment
export async function addAssignment (docId:string, content:any, translatedContent:any, moduleId:number) {
    var dataAdd = {
        content:   content,
        translatedContent: translatedContent,
        date: new Date().toString(),
        moduleId: moduleId,
        usersCompleted: []
    }

    await addDoc(collection(doc(collection(db, "organizations"), docId), "assignments"), dataAdd)

    return dataAdd
}

export async function addModule (docId:string, title:string, description:string) {
    const length = (await getDocs(collection(doc(collection(db, "organizations"), docId), "modules"))).size

    const dataAdd = {
        title: title, 
        description: description,
        id: length
    } 

    await addDoc(collection(doc(collection(db, "organizations"), docId), "modules"), dataAdd)

    return dataAdd
}

export async function getOrganizationInfo (docId:string) {
    var assignments = [] as any
    var modules = [] as any
    
    var query = await getDocs(collection(doc(collection(db, "organizations"), docId), "assignments"))
    query.forEach((document: QueryDocumentSnapshot<DocumentData>) => {
        assignments.push(document.data())
    })

    query = await getDocs(collection(doc(collection(db, "organizations"), docId), "modules"))
    query.forEach((document: QueryDocumentSnapshot<DocumentData>) => {
        modules.push(document.data())
    })

    return [assignments, sortIdDictionary(modules)]
}

export async function addUserCompletedToAssign (organizationId:string, dateAssignment:string, userId:string, extraInfo:string="") {
    // find assignment
    const q = query(
        collection(doc(collection(db, "organizations"), organizationId), "assignments"), 
        where("date", "==", dateAssignment)
    ) 

    const queryResult = await getDocs(q)
    var idDoc:any
    queryResult.forEach((document: QueryDocumentSnapshot<DocumentData>) => {
        idDoc = document.id
    })

    await updateDoc(doc(collection(doc(collection(db, "organizations"), organizationId), "assignments"), idDoc), {
        usersCompleted: arrayUnion(userId + (extraInfo.length > 0 ? (";" + extraInfo) : ""))
    })
}

export async function handleLogOut (setUser: (e:any)=>void, setAssignments: (e:any)=>void) {
    await auth.signOut() 
    setUser({
        username: "",
        userId: "",
        language: "",
        isOrganization: false,
        organizationId: "",
        organizationName: "",
        docOrganizationId: ""
    })
    setAssignments([] as any)
}


export async function getUsersInOrganization (organizationId:string) {
    const document = await getDoc(doc(collection(db, "organizations"), organizationId))
    if (!document || !document.data()) return ""

    var userIds:string[] = document.data()!["users"]
    var overallDocs:any[] = []
    for (var i = 0; i < userIds.length; i++) {
        const q = query(collection(db, "users"), where("userId", "==", userIds[i]))
        var docResult = {} as any

        const result = await getDocs(q)  
        result.forEach((doc:any) => {
            docResult = doc.data()
        })

        overallDocs.push(docResult)
    }
    return overallDocs
}

export async function uploadImage (image:File) {
    const imgUUID = v4()
    const storageRef = ref(storage, `/images/${imgUUID}`)
    await uploadBytes(storageRef, image)    
    return imgUUID
}

export async function getImage (uuid:string) {
    const storageRef = ref(storage, `/images/${uuid}`)
    console.log(storageRef)
    return await getDownloadURL(storageRef)
}

export async function deleteUserAccount(userID:string){
try{
    const auth = getAuth();
    const user:any = auth?.currentUser;
    
    deleteUser(user).then(() => {
      // User deleted.
    }).catch((error) => {
      console.error(error)
    });
}catch(err){
    console.error(err);
}
}

export async function updateUserPassword(newPassword:string){
    try{
        const auth = getAuth();
        const user:any = auth?.currentUser;

        updatePassword(user, newPassword).then(()=>{

        }).catch((err)=>{
            console.error(err)
        })
    }catch(err){
        console.error(err)
    }
}


function reauthWithGoogle() {
    const loginAuth:any = getAuth();
    const googleProvider = new GoogleAuthProvider();

    return reauthenticateWithPopup(loginAuth, googleProvider)
}

export async function updateUserName(
    newUserName: string,
    docID: string,
  ) {
    try {

        const auth = getAuth();
        const user:any = auth?.currentUser;

       await reauthWithGoogle()

        await updateEmail(user, `${newUserName}@gmail.com`).then(async() => {
 
        }).catch((error) => {
            console.error("Error updating email:", error);
        });
const data = await doc(db, "organizations", docID);

await updateDoc(data, {
    username: newUserName,
});

    } catch (error) {
        reauthWithGoogle()
      console.error("Error updating username:", error);
    }
  }

export async function deleteAssignment (data:any, organizationId:string) {
    // delete the embedded images if there are any
    var content = JSON.parse(data.content)
    for (var i = 0; i < content.length; i++) {
        if (content[i].id === 4) {
            const imageURL = content[i].content
            await deleteObject(ref(storage, `/images/${imageURL}`)).catch((err:any) => console.log("err deleting image:", err))
        }
    }

    const q = query(collection(doc(collection(db, "organizations"), organizationId), "assignments"), where("date", "==", data.date))

    const querySnapshot = await getDocs(q)
    var d:any = null
    querySnapshot.forEach(async (doc:QueryDocumentSnapshot<DocumentData>) => {
        d = doc.ref
    })

    if (d != null) 
        await deleteDoc(d);
    else console.log("DIDN'T SUCCESSFULLY DELETE DOC")
}