import { auth } from "@/firebase"
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import Link from "next/link";


export default function Dashboard() {

  const [user, setUser] = useAuthState(auth);

  async function logout(e:any) {
    e.preventDefault()
    await auth.signOut()
    .then(() => window.location.replace('/'))
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
          <Link href="/dashboard" className="px-4 py-2 bg-white text-black transition-colors">Home</Link>
          <Link href="/eventViewer" className="px-4 py-2 hover:bg-gray-700 transition-colors">Current Events</Link>
          <Link href="/host" className="px-4 py-2 hover:bg-gray-700 transition-colors">Host Event</Link>
          <Link href="/certificate" className="px-4 py-2 hover:bg-gray-700 transition-colors">View Certificates</Link>
        </div>
      </section>
      <section  className="flex flex-1 justify-around items-center">
        <div className="card max-w-full w-[500px] m-4">
          <img src={String(user?.photoURL)} className=" rounded-full"/>
          <div className=" text-3xl">Welcome, <span className="font-bold">{user?user.displayName:"Event Box User"}</span></div>
          <div>{user?user.email:"eventbox@example.com"}</div>
          <div className="btn-array flex mt-6 flex-wrap">
            <Link href="/dashboard"   className="block cursor-pointer mr-2 my-1 font-semibold hover:bg-white hover:text-black px-4 py-2 border-[1px] transition-colors" >Home</Link>
            <Link href="/eventViewer" className="block cursor-pointer mr-2 my-1 font-semibold hover:bg-white hover:text-black px-4 py-2 border-[1px] transition-colors" >Current Events</Link>
            <Link href="/certificate" className="block cursor-pointer mr-2 my-1 font-semibold hover:bg-white hover:text-black px-4 py-2 border-[1px] transition-colors" >View Certificates</Link>
            <Link href="/host" className="block cursor-pointer mr-2 my-1 font-semibold hover:bg-white hover:text-black px-4 py-2 border-[1px] transition-colors" >Host Event</Link>
            <Link href="" onClick={e => logout(e)} className="block cursor-pointer mr-2 my-1 font-semibold text-red-500 hover:bg-red-500 hover:text-black px-4 py-2 border-[1px] border-red-500 transition-colors" >Log Out</Link>
          </div>
        </div>
      </section>
      <footer className="px-12 py-4 border-gray-600 border-t-[1px] text-white">
        Made by Indranil Das
      </footer>
    </section>
  )
}