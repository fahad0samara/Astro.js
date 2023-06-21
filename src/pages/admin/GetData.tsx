

// export default GetData
import {useState, useEffect} from "preact/compat";
const GetData = () => {
  const [cats, setCats] = useState([]);
  
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingCatId, setDeletingCatId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
 
  const [updatedCatData, setUpdatedCatData] = useState({
    _id: "",

    image: "",
    translations: [
      {
        language: "ar",
        name: "",
        breed: "",
     
      },
      {
        language: "en",
        name: "",
        breed: "",
       
      },
    ],
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);


const [errors, setErrors] = useState({
  nameEn: "",
  breedEn: "",
  nameAr: "",
  breedAr: "",
});
const [hasErrors, setHasErrors] = useState(false);

const validateArabicInput = (field, value) => {
  const arabicRegex = /^[\u0600-\u06FF\s]+$/; // Regular expression to match Arabic characters and spaces
  if (!value) {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: "This field cannot be empty.",
    }));
       setHasErrors(true);
  } else if (!arabicRegex.test(value)) {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: "Only Arabic characters are allowed.",
    }));
       setHasErrors(true);
  } else {
    setErrors(prevErrors => ({ ...prevErrors, [field]: "" }));
       setHasErrors(false);
  }

};

const validateEnglishInput = (field, value) => {
  const englishRegex = /^[A-Za-z\s]+$/; // Regular expression to match English characters and spaces
  if (!value) {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: "This field cannot be empty.",
    }));
       setHasErrors(true);
  } else if (!englishRegex.test(value)) {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: "Only English characters are allowed.",
    }));
       setHasErrors(true);
  } else {
    setErrors(prevErrors => ({ ...prevErrors, [field]: "" }));
    setHasErrors(false);
  }
  
};


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

      // Check if the updated cat exists in the fetched data
      const updatedCatIndex = data.cats.findIndex(
        cat => cat._id === updatedCatData._id
      );

      if (updatedCatIndex !== -1) {
        // If the updated cat exists, replace it in the fetched data
        data.cats[updatedCatIndex] = updatedCatData;
      }

      setCats(data.cats);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cats:", error);
    }
  };

  const handleDeleteCat = async catId => {
    setDeletingCatId(catId);
    setConfirmDelete(true);
  };

  const confirmDeleteCat = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:1995/cat/api/cats/${deletingCatId}`,
        {
          method: "DELETE",
        }
      );

      setCats(prevCats => prevCats.filter(cat => cat._id !== deletingCatId));
    } catch (error) {
      console.log("Failed to delete cat:", error);
    } finally {
      setDeletingCatId("");
      setConfirmDelete(false);
      setLoading(false);
    }
  };

  const handleUpdateCat = async catId => {



    const catToUpdate = cats.find(cat => cat._id === catId);
    if (catToUpdate) {
      setUpdatedCatData({
        _id: catToUpdate._id,
        image: catToUpdate.image,
        translations: [
          {
            ...updatedCatData.translations[0],
            name: catToUpdate.translations[0].name,
            breed: catToUpdate.translations[0].breed,
            description: catToUpdate.translations[0].description,
          },
          {
            ...updatedCatData.translations[1],
            name: catToUpdate.translations[1].name,
            breed: catToUpdate.translations[1].breed,
            description: catToUpdate.translations[1].description,
          },
        ],
      });
    }
    setShowUpdateModal(true);
  };

    const handleBlur = (field, value) => {
      if (field === "nameEn") {
        validateEnglishInput(field, value);
      } else if (field === "breedEn") {
        validateEnglishInput(field, value);
      } else if (field === "nameAr") {
        validateArabicInput(field, value);
      } else if (field === "breedAr") {
        validateArabicInput(field, value);
      }
    };

const submitUpdateCat = async event => {
  event.preventDefault();

  // Validate the input fields
  validateArabicInput("nameAr", updatedCatData.translations[0].name);
  validateEnglishInput("nameEn", updatedCatData.translations[1].name);
  validateArabicInput("breedAr", updatedCatData.translations[0].breed);
  validateEnglishInput("breedEn", updatedCatData.translations[1].breed);

  // Check if there are any errors
  const hasErrors = Object.values(errors).some(error => error !== "");
  if (hasErrors) {
    return; // Don't submit if there are errors
  }
 

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("_id", updatedCatData._id);
    formData.append(
      "translations",
      JSON.stringify(updatedCatData.translations)
    );

    const response = await fetch(
      `http://localhost:1995/cat/api/cats/${updatedCatData._id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      const updatedCat = await response.json();
      setUpdatedCatData(prevData => ({
        ...prevData,
        image: updatedCat.cat.image, // Update the image URL
      }));

      setCats(prevCats =>
        prevCats.map(cat =>
          cat._id === updatedCatData._id
            ? {
                ...cat,
                image: updatedCat.cat.image,
                translations: updatedCatData.translations,
              }
            : cat
        )
      );
    } else {
      console.log("Failed to update cat:", response.statusText);
    }
  } catch (error) {
    console.log("Failed to update cat:", error);
  } finally {
    setShowUpdateModal(false);
    setLoading(false);
  }
};


 const handleUpdateInputChange = event => {
   const {name, value, dataset} = event.target;
   const language = dataset.language;

   if (language === "ar") {
     validateArabicInput(name, value);
   } else if (language === "en") {
     validateEnglishInput(name, value);
   }

   setUpdatedCatData(prevData => ({
     ...prevData,
     translations: prevData.translations.map(translation =>
       translation.language === language
         ? {...translation, [name]: value}
         : translation
     ),
   }));
 };


   const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);

    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };
   
    const handleUpdateModalClose = () => {
  
      setUpdatedCatData({
        _id: "",
        image: "",
        translations: [
          {
            language: "ar",
            name: "",
            breed: "",
          },
          {
            language: "en",
            name: "",
            breed: "",
          },
        ],
      });
      setShowUpdateModal(false);
      setErrors({
        nameEn: "",
        breedEn: "",
        nameAr: "",
        breedAr: "",
      });
    };


  const catArray = Array.isArray(cats) ? cats : [cats];

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

 

  return (
    <div>
      <div class="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
        <div class="flex items-center justify-between pb-6">
          <div>
            <h2 class="font-semibold text-gray-700">Cats list</h2>
            <span class="text-xs text-gray-500">{cats.length} cats</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="ml-10 space-x-8 lg:ml-40">
              <button class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring hover:bg-blue-700">
                CSV
              </button>
            </div>
          </div>
        </div>
        <div class="overflow-y-hidden rounded-lg border">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                  <th class="px-5 py-3">ID</th>
                  <th class="px-5 py-3">Full Name</th>
                  <th class="px-5 py-3"> breed</th>
                  <th class="px-5 py-3">Created at</th>
                  <th class="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="text-gray-500">
                {catArray.map(cat => {
                  const translation = cat.translations.find(
                    t => t.language === language
                  );
                  return (
                    <tr key={cat.id}>
                      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p class="whitespace-no-wrap">{cat.id}</p>
                      </td>
                      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0">
                            <img
                              class="h-full w-full rounded-full"
                              src={cat.image}
                              alt=""
                            />
                          </div>
                          <div class="ml-3">
                            <p class="whitespace-no-wrap">
                              {" "}
                              {translation?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p class="whitespace-no-wrap"> {translation?.breed}</p>
                      </td>
                      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p class="whitespace-no-wrap">{cat.createdAt}</p>
                      </td>

                      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <span
                          class={`rounded-full bg-${cat.statusColor} px-3 py-1 text-xs font-semibold text-${cat.statusColorText}`}
                        >
                          {confirmDelete && deletingCatId === cat._id ? (
                            <div>
                              Are you sure you want to delete this cat?
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={confirmDeleteCat}
                              >
                                Yes
                              </button>
                              <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setConfirmDelete(false)}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleDeleteCat(cat._id)}
                            >
                              Delete
                            </button>
                          )}

                          <button onClick={() => handleUpdateCat(cat._id)}>
                            Edit
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div class="flex flex-col items-center border-t bg-white px-5 py-5 sm:flex-row sm:justify-between">
            <span class="text-xs text-gray-600 sm:text-sm">
              Showing {page} of {totalPages} Entries{" "}
            </span>
            <div class="mt-2 inline-flex sm:mt-0">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                class="mr-2 h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100"
              >
                Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                class="h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUpdateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto ">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom   rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Update Cat
                </h2>
                <form onSubmit={submitUpdateCat}>
                  <div className="mb-4 flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-4 ">
                      <label htmlFor="name" className="block text-gray-700">
                        Name (Arabic):
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={updatedCatData.translations[0].name}
                        onChange={handleUpdateInputChange}
                        data-language="ar"
                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                          errors.nameAr ? "border-red-500" : "border-gray-200"
                        } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                        onBlur={e => handleBlur("nameAr", e.target.value)}
                      />
                      {errors.nameAr && (
                        <span className="text-red-500 text-xs italic">
                          {errors.nameAr}
                        </span>
                      )}
                    </div>
                    <div>
                      <div></div>
                      <label htmlFor="breed" className="block text-gray-700">
                        Breed (Arabic):
                      </label>
                      <input
                        type="text"
                        name="breed"
                        value={updatedCatData.translations[0].breed}
                        onChange={handleUpdateInputChange}
                        data-language="ar"
                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                          errors.breedAr ? "border-red-500" : "border-gray-200"
                        } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                        onBlur={e => handleBlur("breedAr", e.target.value)}
                      />
                      {errors.breedAr && (
                        <span className="text-red-500 text-xs italic">
                          {errors.breedAr}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                    <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
                      <label htmlFor="name" className="block text-gray-700">
                        Name (English):
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={updatedCatData.translations[1].name}
                        onChange={handleUpdateInputChange}
                        data-language="en"
                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                          errors.nameEn ? "border-red-500" : "border-gray-200"
                        } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                        onBlur={e => handleBlur("nameEn", e.target.value)}
                      />
                      {errors.nameEn && (
                        <span className="text-red-500 text-xs italic">
                          {errors.nameEn}
                        </span>
                      )}
                    </div>

                    <div className="w-full sm:w-1/2 pl-0 sm:pl-2 mt-4 sm:mt-0">
                      <label htmlFor="breed" className="block text-gray-700">
                        Breed (English):
                      </label>
                      <input
                        type="text"
                        name="breed"
                        value={updatedCatData.translations[1].breed}
                        onChange={handleUpdateInputChange}
                        data-language="en"
                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                          errors.breedEn ? "border-red-500" : "border-gray-200"
                        } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                        onBlur={e => handleBlur("breedEn", e.target.value)}
                      />
                      {errors.breedEn && (
                        <span className="text-red-500 text-xs italic">
                          {errors.breedEn}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="image"
                    >
                      Image:
                    </label>
                    <div className="relative border-dashed border-2 border-gray-400 rounded-lg h-44">
                      <input
                        className="h-full w-full opacity-0"
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview ? (
                        <div className="absolute top-0 left-0 h-full w-full">
                          <img
                            src={imagePreview}
                            alt="Selected image preview"
                            className="h-full w-full object-cover rounded-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-opacity-75 bg-gray-700 rounded-b-lg">
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
                              onClick={() => setImagePreview(null)}
                            >
                              Cancel or Change
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="flex flex-col items-center justify-center">
                            <span className="block text-gray-400 font-normal">
                              Select a file or drag and drop it here
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      disabled={hasErrors}
                      type="submit"
                      className={`
                      ${hasErrors ? "opacity-50 cursor-not-allowed" : ""}
                      inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      Update
                    </button>
                    <button
                      onClick={handleUpdateModalClose}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-2 sm:mt-0"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetData;
