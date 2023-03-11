import { Inter } from 'next/font/google'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useEffect } from 'react';
import { redirect } from 'next/navigation'
import { Router } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const googleAuth = new GoogleAuthProvider();

  const [user, setUser] = useAuthState(auth);

  async function login(e:any) {
    e.preventDefault();
    await signInWithPopup(auth, googleAuth)
    .then(() => window.location.replace("/dashboard"))
    .catch(e => { console.log("Pop-Up Closed") })
  }

  return (
    <section className="h-screen w-screen bg-black flex flex-col">
      <header className='px-12 py-4 border-gray-600 border-b-[1px]'>
        <h1 className='text-4xl font-bold text-white'>Event Box</h1>
      </header>
      <div className=" flex text-white flex-col max-sm:items-center flex-1 py-12">
        <span className=' block text-8xl px-16 max-sm:text-4xl max-sm:font-semibold font-black tracking-widest uppercase'>Host Them</span>
        <span className=' block text-8xl px-16 max-sm:text-4xl max-sm:font-semibold font-black tracking-widest uppercase'>Play Them</span>
        <span className=' block text-8xl px-16 max-sm:text-4xl max-sm:font-semibold font-black tracking-widest uppercase'>Win Them</span>
        <button onClick={e => login(e)} className='w-max mx-16 my-16 border-[1px] px-12 py-6 max-sm:px-6 max-sm:py-3 max-sm:text-xl text-4xl font-bold hover:text-black hover:bg-white transition-colors'>Join Now</button>
      </div>
      <footer className="px-12 py-4 border-gray-600 border-t-[1px] text-white">
        Made by Indranil Das
      </footer>
    </section>
  )
}
