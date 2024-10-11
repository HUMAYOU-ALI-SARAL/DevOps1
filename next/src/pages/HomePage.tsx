// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// const HomePage = () => {
//   return (
//     <div className="bg-[url('/Images/HomeBackground.webp')] bg-cover bg-no-repeat h-screen w-full">
//       <div className='w-full h-screen flex justify-center items-center'>
        
//         <div className='bg-black bg-opacity-40 p-8 mx-6 md:p-16 rounded-3xl text-center text-white border-2 border-orange' style={{ boxShadow:"0 0 20px 12px rgba(255,127,42,0.2)" }}>
//           <div className="flex justify-center mb-4 ">
//             <img src="/Images/Logo.webp" alt="Sphera World Logo" className="h-32 w-32" />
//           </div>
//           <img src="/Images/SpheraWorld.webp" alt="Sphera World Logo" className="h-6 w-[70%] m-auto" />
//           <p className="text-orange text-2xl mt-2 font-jura">PHASE ONE: SUMMER SEASON</p>
//           <Link href="/second" passHref>
//             <button
//               className="mt-6 text-white font-jura py-2 px-4 rounded w-full"
//               style={{
//                 borderRadius: '7.441px',
//                 border: '1.488px solid #FF7F2A',
//                 background: 'linear-gradient(180deg, rgba(255, 127, 42, 0.07) 0%, rgba(255, 127, 42, 0.25) 100%)',
//                 boxShadow: '0 4px 6px -1px rgba(255, 127, 42, 0.5), 0 2px 4px -1px rgba(255, 127, 42, 0.06)'
//               }}
//             >
//               ENTER ARENA
//             </button>
//           </Link>
//         </div>
      
//       </div>
//     </div>
//   );
// };

// export default HomePage;


'use client';
import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.26/build/spline-viewer.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}> {/* Ensure full width and height */}
      <spline-viewer
        url="https://prod.spline.design/unZk2bFrdJdBf2fG/scene.splinecode"
        style={{ height: '100%', width: '100%' }}
      ></spline-viewer>
    </div>
  );
};

export default HomePage;