// import {memo} from "preact/compat";
// import {useState, useEffect} from "preact/hooks";
// import axios from "axios";

// const CatsList = memo(() => {
//   const [cats, setCats] = useState([]);
//   const [language, setLanguage] = useState("en")
//   const [page, setPage] = useState(1); // Track the current page
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchCats();
//   }, [language, page]); // Include 'page' in the dependency array

//   const fetchCats = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("http://localhost:1995/cat/api/cats", {
//         params: {lang: language, page: page, limit: 6}, // Add 'page' parameter
//       });
//       setCats(response.data);
//       console.log('====================================');
//       console.log(response.data);
//       console.log('====================================');
//     } catch (error) {
//       console.error("Error fetching cats:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLanguageChange = selectedLanguage => {
//     setLanguage(selectedLanguage);
//   };

//   const handlePrevPage = () => {
//     setPage(prevPage => prevPage - 1); // Decrease the current page by 1
//   };

//   const handleNextPage = () => {
//     setPage(prevPage => prevPage + 1); // Increase the current page by 1
//   };

//   return (
//     <div>
//       <button onClick={() => handleLanguageChange("en")}>English</button>
//       <button onClick={() => handleLanguageChange("ar")}>Arabic</button>

//       <h1 className="text-2xl font-bold mb-4">Cats List</h1>

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
//           {cats.map(cat => (
//             <div
//               className="border border-gray-500 rounded-lg p-4 shadow-md hover:border-gray-300"
//               key={cat._id}
//             >
//               <h2 className="text-xl font-bold mb-2">
//                 Name: {language === "ar" ? cat.nameArabic : cat.name}
//               </h2>
//               <h3 className="text-lg font-semibold mb-2">Breed: {cat.breed}</h3>
//               <p className="mb-4">Description: {cat.description}</p>
//               <img
//                 src={cat.image}
//                 alt={cat.name}
//                 className="w-full h-auto object-cover"
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-4">
//         <button
//           onClick={handlePrevPage}
//           disabled={page === 1}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
//         >
//           Previous Page
//         </button>
//         <button
//           onClick={handleNextPage}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Next Page
//         </button>
//       </div>
//     </div>
//   );
// });

// export default CatsList;
import {useState, useEffect} from "preact/compat";

const CatList = () => {
  const [cats, setCats] = useState([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCats();
  }, [page, perPage]);

  const fetchCats = async () => {
    try {
      const response = await fetch(
        `http://localhost:1995/cat/api/cats?page=${page}&perPage=${perPage}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cats");
      }

      const data = await response.json();
      setCats(data.cats);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cats:", error);
    }
  };

  const handleLanguageToggle = () => {
    setLanguage(prevLanguage => (prevLanguage === "en" ? "ar" : "en"));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (loading) {
    return <p>Loading cats...</p>;
  }

  const catArray = Array.isArray(cats) ? cats : [cats];

  return (
    <div className="container mx-auto p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleLanguageToggle}
      >
        {language === "en" ? "عربي" : "Switch to English"}
      </button>
      <h1 className="text-2xl font-bold mb-4">Cats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {catArray.map(cat => {
          const translation = cat.translations.find(
            t => t.language === language
          );

          return (
            <div key={cat._id} className="bg-white rounded-lg shadow-md">
              <a href="#">
                <img
                  className="h-60 w-full  rounded-t-lg"
                  src={cat.image}
                  alt="Cat"
                />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="text-xl font-semibold text-slate-900">
                    {translation?.name}
                  </h5>
                </a>
                <div className="mt-2.5 mb-5 flex items-center">
                  <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                    {translation?.breed }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p>{translation?.description }</p>
             
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <span className="text-gray-500">
          Page {page} of {totalPages}
        </span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default CatList;




