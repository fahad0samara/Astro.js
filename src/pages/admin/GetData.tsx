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
  const [updatingCatId, setUpdatingCatId] = useState("");
  const [updatedCatData, setUpdatedCatData] = useState({
    _id: "",

    image: "",
    translations: [
      {
        language: "ar",
        name: "",
        breed: "",
        image: "",
      },
      {
        language: "en",
        name: "",
        breed: "",
        image: "",
      },
    ],
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);

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
    setUpdatingCatId(catId);
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

  const submitUpdateCat = async event => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:1995/cat/api/cats/${updatedCatData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedCatData,
            translations: JSON.stringify(updatedCatData.translations),
          }),
        }
      );

      setCats(prevCats =>
        prevCats.map(cat =>
          cat._id === updatedCatData._id
            ? {
                ...cat,
                image: updatedCatData.image,
                translations: updatedCatData.translations,
              }
            : cat
        )
      );
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

    setUpdatedCatData(prevData => ({
      ...prevData,
      translations: prevData.translations.map(translation =>
        translation.language === language
          ? {...translation, [name]: value}
          : translation
      ),
    }));
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
        <div className="fixed z-10 inset-0 overflow-y-auto">
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Update Cat
                </h2>
                <form onSubmit={submitUpdateCat}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">
                      Name (Arabic):
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedCatData.translations[0].name}
                      onChange={handleUpdateInputChange}
                      data-language="ar"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="breed" className="block text-gray-700">
                      Breed (Arabic):
                    </label>
                    <input
                      type="text"
                      name="breed"
                      value={updatedCatData.translations[0].breed}
                      onChange={handleUpdateInputChange}
                      data-language="ar"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">
                      Name (English):
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedCatData.translations[1].name}
                      onChange={handleUpdateInputChange}
                      data-language="en"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="breed" className="block text-gray-700">
                      Breed (English):
                    </label>
                    <input
                      type="text"
                      name="breed"
                      value={updatedCatData.translations[1].breed}
                      onChange={handleUpdateInputChange}
                      data-language="en"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setShowUpdateModal(false)}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ml-2"
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
