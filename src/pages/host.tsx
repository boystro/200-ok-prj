import { auth, deleteEvent, getOwnEvents, newEvent } from "@/firebase"
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import Link from "next/link";

export default function HostEvent() {

  const [docs, setDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>();

  const [evname, setEvname] = useState<string>();
  const [evdesc, setEvdesc] = useState<string>();
  const [evdate, setEvdate] = useState<string>();

  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();

  const [user, setUser] = useAuthState(auth);

  async function logout(e:any) {
    e.preventDefault()
    await auth.signOut()
    .then(() => window.location.replace('/'))
  }

  function handleSubmit(e:any) {
    e.preventDefault();

    if (user == null)
      return

    if (evname == undefined) {
      setFormError("Event Name undefined")
      return
    }

    if (evdate == undefined) {
      setFormError("Event Date undefined")
      return
    }

    if (evdesc == undefined) {
      setFormError("Event Description undefined")
      return
    }
    
    newEvent(
      evname,
      evdate || "",
      evdesc || "",
      user?.displayName || "",
      user?.email || ""
    ).then(
      () => {
        setFormError("");
        setFormSuccess("Added Event. Refresh to View Changes");
        (document.getElementById("ev-name") as HTMLInputElement).value = "";
        (document.getElementById("ev-date") as HTMLInputElement).value = "";
        (document.getElementById("ev-description") as HTMLInputElement).value = "";
      }
    ).catch(e => {
      setFormError("Server failed to respond")
      setFormSuccess("");
      console.log(e)
    })
  }

  function deleteData(docid:string) {
    deleteEvent(docid);
  }

  useEffect(() => {
    if (user == null)
      return;
    if (user.email == null)
      return;
    
    getOwnEvents(user.email)
    .then( snapshot => setDocs(snapshot.docs) )
  }, [user])

  function renderCreatedEvents() {
    return docs?.map((doc, i) => {
      const data = doc.data();
      return (
        <div className="py-2" key={i}>
          <div className=" flex justify-between mb-1">
            <span className="flex">
              <span className="px-2 bg-white text-black font-bold cursor-default">{data.participants.length}</span>
              <h2 className="font-bold ml-2">{data.eventName}</h2>
            </span>
            <button onClick={() => deleteData(doc.id)} className="text-red-500 hover:bg-red-500 hover:text-black px-2 font-semibold transition-colors">Delete</button>
          </div>
          <p className="my-2 text-gray-400">{data.eventDescription}</p>
          <div className="flex justify-between mt-1">
            <div className="text-blue-500">Date : {data.eventDate}</div>
            <div className="text-gray-300 underline decoration-1 underline-offset-2 cursor-pointer hover:text-blue-400 transition-colors">
              <Link href={'data:text/plain;charset=utf-8,' + encodeURIComponent(data.participants.join("\n"))} id="participant-list" download={data.eventName + " - Participant List.txt"}>
                Participant List
              </Link>
            </div>
          </div>
        </div>
      )
    })
  }

  return(
    <section className="min-h-screen w-screen bg-black flex flex-col text-white">
      <header className='px-12 py-4 border-gray-600 border-b-[1px] flex max-sm:flex-col justify-between items-center'>
        <h1 className='text-4xl font-bold'>Event Box</h1>
        <div className=" divide-x-[1px] divide-gray-600">
          <span className="px-3">Hello, <span className=" text-blue-400">{user?user.displayName:"Event Box User"}</span></span>
          <button onClick={e => logout(e)} className="px-3 hover:text-red-400 transition-colors">Log Out</button>
        </div>
      </header>
      <section>
        <div className="flex w-full divide-x-[1px] divide-gray-400 border-b-[1px] border-gray-600">
          <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-700 transition-colors">Home</Link>
          <Link href="/eventViewer" className="px-4 py-2 hover:bg-gray-700 transition-colors">Current Events</Link>
          <Link href="/host" className="px-4 py-2 bg-white text-black transition-colors">Host Event</Link>
          <Link href="/certificate" className="px-4 py-2 hover:bg-gray-700 transition-colors">View Certificates</Link>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-around max-lg:flex-col">
        <form onSubmit={e => handleSubmit(e)} className="flex flex-col max-w-[500px] w-full m-4">

          {formError?
            <label className="border-[1px] border-red-500 px-2 py-1 text-red-500 bg-[#ff000033]">
              <span className="font-bold">ERROR</span> {formError}
            </label>:<></>
          }

          {formSuccess?
            <label className="border-[1px] border-green-500 px-2 py-1 text-green-500 bg-[#1bff1333]">
              <span className="font-bold">SUCCESS</span> {formSuccess}
            </label>:<></>
          }
          
          <label htmlFor="ev-name" className=" text-xl mt-2 font-semibold">Event Name</label>
            <input onChange={ e => setEvname(e.target.value) } type="text" id="ev-name" name="ev-name"  className=" px-2 py-1 w-full font-light border-[1px] border-gray-600 focus:border-white bg-black outline-none"/>
          <label htmlFor="ev-date" className=" text-xl mt-2 font-semibold">Event Date</label>
            <input onChange={ e => setEvdate(e.target.value) } type="date" id="ev-date" name="ev-date"  className=" px-2 py-1 w-full font-light border-[1px] border-gray-600 focus:border-white bg-black outline-none"/>
          <label htmlFor="ev-description" className=" text-xl mt-2 font-semibold">Event Description</label>
            <textarea onChange={ e => setEvdesc(e.target.value) } name="ev-description" id="ev-description" cols={30} rows={10} className=" px-2 py-1 w-full font-light border-[1px] border-gray-600 focus:border-white bg-black outline-none resize-none"></textarea>

          <input type="submit" value="Add Event" className="px-4 py-2 w-max mt-2 border-[1px] hover:bg-white hover:text-black transition-colors cursor-pointer font-semibold"/>
        </form>
        
        <div className="flex flex-col max-w-[500px] w-full m-4 divide-y-[1px] divide-gray-400">

          {renderCreatedEvents()}

        </div>

      </section>

      <footer className="px-12 py-4 border-gray-600 border-t-[1px] text-white">
        Made by Indranil Das
      </footer>
    </section>
  )
}