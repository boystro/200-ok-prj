import { auth, getEvents, userParticipateEvent, userDeparticipateEvent } from "@/firebase"
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import Link from "next/link";

export default function Certificate() {

  const [user, setUser] = useAuthState(auth);
  const [docs, setDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>();
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (user == null)
      return;
    
    if (user.email == null)
      return;

    getEvents(user.email)
    .then( snapshot => setDocs(snapshot.docs) )
  }, [user])

  async function logout(e:any) {
    e.preventDefault()
    await auth.signOut()
    .then(() => window.location.replace('/'))
  }

  function participate(docid:string) {
    if (!user) return;
    if (!user.email) return;
    userParticipateEvent(user.email, docid)
    .then( () => window.location.reload() )
  }

  function departicipate(docid:string) {
    if (!user) return;
    if (!user.email) return;
    userDeparticipateEvent(user.email, docid)
    .then( () => window.location.reload() )
  }

  function renderAllEvents() {
    return docs?.map((doc, i) => {
      const data = doc.data();

      var isParticipant = false;
      if (user && user.email)
        if (data.participants.find((x:any) => x == user.email))
          isParticipant = true;

      return (
        <div className="py-2" key={i}>
          <div className=" flex justify-between mb-1">
            <span className="flex">
              <span className="px-2 bg-white text-black font-bold cursor-default">{data.participants.length}</span>
              <h2 className="font-bold ml-2">{data.eventName}</h2>
            </span>
            {!isParticipant?
            <button onClick={() => participate(doc.id)} className="text-green-500">Participate</button>:
            <button onClick={() => departicipate(doc.id)} className="text-red-500">UnParticipate</button>}
          </div>
          <p className="my-2 text-gray-400">{data.eventDescription}</p>
          <div className="flex justify-between mt-1">
            <div className="text-blue-500">Date : {data.eventDate}</div>
            <div className="text-gray-600">Organized By : {data.hostName}</div>
          </div>
        </div>
      )
    })
  }

  return(
    <section className="h-screen w-screen bg-black flex flex-col text-white">
      <header className='px-12 py-4 border-gray-600 border-b-[1px] flex max-sm:flex-col justify-between items-center'>
        <h1 className='text-4xl font-bold'>Event Box</h1>
        <div className=" divide-x-[1px] divide-gray-600">
          <span className="px-3">Hello, <span className=" text-blue-400">{user?user.displayName:"Event Box User"}</span></span>
          <button onClick={e => logout(e)} className="px-3 hover:text-red-400 transition-colors">Log Out</button>
        </div>
      </header>
      <section className="">
        <div className="flex w-full divide-x-[1px] divide-gray-400 border-b-[1px] border-gray-600">
          <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-700 transition-colors">Home</Link>
          <Link href="/eventViewer" className="px-4 py-2 bg-white text-black transition-colors">Current Events</Link>
          <Link href="/host" className="px-4 py-2 hover:bg-gray-700 transition-colors">Host Event</Link>
          <Link href="/certificate" className="px-4 py-2 hover:bg-gray-700 transition-colors">View Certificates</Link>
        </div>
      </section>
      <section className="flex-1 px-4 mx-auto flex flex-col max-w-[700px] w-full m-4 divide-y-[1px] divide-gray-400">
        { renderAllEvents() }
      </section>
      <footer className="px-12 py-4 border-gray-600 border-t-[1px] text-white">
        Made by Indranil Das
      </footer>
    </section>
  )
}