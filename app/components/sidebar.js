// app/components/Sidebar.js

// app/components/Sidebar.js
'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { darkMode } = useTheme();

  return (
    <div 
      className={`w-64 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} h-screen p-4`}
    >
      <h2 className="text-2xl font-bold mb-4">Interview Guide</h2>
      <p className="text-sm mb-4">
        A one-stop place to ensure complete interview preparation. From company background to sample interview questions and answers, all available in one go.
        Try using it to ace your interviews and get into your dream company!
      </p>
      
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Features:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Comprehensive company profiles.</li>
          <li>Sample interview questions and answers.</li>
          <li>Tips and tricks for interview success.</li>
          <li>Practice tests and quizzes.</li>
        </ul>
      </section>

      <section>
        {/* <h3 className="text-lg font-semibold mb-2">Quick Links:</h3>  */}
        <ul className="space-y-4">
          {/* Uncomment these links when needed */}
          {/* <li><a href="#" className="hover:underline">Home</a></li> */}
          {/* <li><a href="#" className="hover:underline">About</a></li> */}
          {/* <li><a href="#" className="hover:underline">Sign Out</a></li> */}
        </ul>
      </section>
    </div>
  );
};

export default Sidebar;



// 'use client';

// import React from 'react';
// import { useTheme } from '../context/ThemeContext';

// const sidebar = () => {
//   const { darkMode } = useTheme();
  
//   return (
//     <div className={`w-64 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} h-screen p-4`}>
//       <h2 className="text-2xl font-bold mb-4">Menu</h2>
//       <ul className="space-y-4">
//         <li><a href="#" className="hover:underline">Home</a></li>
//         <li><a href="#" className="hover:underline">About</a></li>
//         <li><a href="#" className="hover:underline">Services</a></li>
//         <li><a href="#" className="hover:underline">Contact</a></li>
//       </ul>
//     </div>
//   );
// };

// export default sidebar;
