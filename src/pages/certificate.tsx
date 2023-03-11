import { auth, getAllEvents } from "@/firebase"
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import Link from "next/link";

export default function Certificate() {

  const [user, setUser] = useAuthState(auth);
  const [participatedEvents, setParticipatedEvents] = useState<any[]>([]);
  const [eventName, setEventName] = useState<string>("");

  async function logout(e:any) {
    e.preventDefault()
    await auth.signOut()
    .then(() => window.location.replace('/'))
  }

  useEffect(()=> {
    if (!user) return;
    if (!user.email) return;
    getAllEvents()
    .then(snapshot => {
      const data = snapshot.docs.filter(doc => doc.data().participants.find((x:any) => x == user.email) )
      setParticipatedEvents(data)
    }).catch()
  }, [user])

  function generateCertificate() {
    var c = document.getElementById("canvas") as HTMLCanvasElement;
    if (!c) return;
    var ctx = c.getContext("2d");
    if (!ctx) return;  
    // ctx.clearRect(0, 0, 2000, 1414)
    var img = new Image(100, 100);
    img.src = "/static/certificate.png";
    ctx.drawImage(img, 0, 0)

    ctx.font = "72px Monotype Corsiva"
    if (user && user.displayName)
      ctx.fillText(user.displayName, 1050 - (user.displayName.length * 18), 800)
    ctx.font = "36px Times new Roman"
    ctx.fillText(eventName, 1000 - (eventName.length * 9), 940)
  }

  function downloadCertificate() {
    var link = document.createElement('a');
    link.download = eventName + " - COA.png";
    link.href = (document.getElementById('canvas') as HTMLCanvasElement).toDataURL()
    link.click();
  }

  function renderEvents() {
    return participatedEvents.map( (event, i) => {
        const data = event.data()
        return (
          <button onClick={() => {
            setEventName(data.eventName) 
            generateCertificate()
          }} className={`border-b-[1px] px-2 py-1 ${data.eventName == eventName? "bg-blue-600" : ""} hover:bg-gray-800 w-full text-left transition-colors`} key={i}>
            {data.eventName}
          </button>
        )
      }
    )
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
      <section>
        <div className="flex w-full divide-x-[1px] divide-gray-400 border-b-[1px] border-gray-600">
          <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-700 transition-colors">Home</Link>
          <Link href="/eventViewer" className="px-4 py-2 hover:bg-gray-700 transition-colors">Current Events</Link>
          <Link href="/host" className="px-4 py-2 hover:bg-gray-700 transition-colors">Host Event</Link>
          <Link href="/certificate" className="px-4 py-2 bg-white text-black transition-colors">View Certificates</Link>
        </div>
      </section>
      <section className="flex-1 w-full flex justify-around items-center">
        <div className="left w-full max-w-[400px]">
          <div className="text-lg font-semibold bg-white text-black px-2">Event List</div>
          {renderEvents()}
        </div>
        <div className="right m-2">
          <canvas id="canvas" className="border-[1px] border-white w-[400px] h-[289px]" width={2000} height={1414}>
          </canvas>
          <div className=" flex justify-around">
            <button onClick={generateCertificate} className="w-full border-t-0 border-[1px] px-4 py-2 hover:bg-white hover:text-black font-semibold transition-colors">Generate</button>
            <button onClick={downloadCertificate} className="w-full border-t-0 border-[1px] px-4 py-2 hover:bg-white hover:text-black font-semibold transition-colors">Download</button>
          </div>
        </div>
      </section>
      <footer className="px-12 py-4 border-gray-600 border-t-[1px] text-white">
        Made by Indranil Das
      </footer>
    </section>
  )
}