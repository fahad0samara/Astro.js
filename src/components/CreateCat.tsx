// import {h, Fragment} from "preact";
// import {useState} from "preact/hooks";
// import axios from "axios";

// const CatForm = () => {
//   const [nameEn, setNameEn] = useState("");
//   const [nameAr, setNameAr] = useState("");
//   const [breedEn, setBreedEn] = useState("");
//   const [breedAr, setBreedAr] = useState("");
//   const [image, setImage] = useState(null);
//   const [minWeight, setMinWeight] = useState(0);
//   const [maxWeight, setMaxWeight] = useState(0);
//   const [descriptionEn, setDescriptionEn] = useState("");
//   const [descriptionAr, setDescriptionAr] = useState("");
//   const [errors, setErrors] = useState({});

//   const validateEnglishInput = (field, value) => {
//     const englishRegex = /^[A-Za-z\s]+$/; // Regular expression to match English characters and spaces
//     if (!value) {
//       setErrors(prevErrors => ({
//         ...prevErrors,
//         [field]: "This field cannot be empty.",
//       }));
//     } else if (!englishRegex.test(value)) {
//       setErrors(prevErrors => ({
//         ...prevErrors,
//         [field]: "Only English characters are allowed.",
//       }));
//     } else {
//       setErrors(prevErrors => ({...prevErrors, [field]: ""}));
//     }
//   };

//   const validateArabicInput = (field, value) => {
//     const arabicRegex = /^[\u0600-\u06FF\s]+$/; // Regular expression to match Arabic characters and spaces
//     if (!value) {
//       setErrors(prevErrors => ({
//         ...prevErrors,
//         [field]: "This field cannot be empty.",
//       }));
//     } else if (!arabicRegex.test(value)) {
//       setErrors(prevErrors => ({
//         ...prevErrors,
//         [field]: "Only Arabic characters are allowed.",
//       }));
//     } else {
//       setErrors(prevErrors => ({...prevErrors, [field]: ""}));
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();

//     // Validation for English fields
//     validateEnglishInput("nameEn", nameEn);
//     validateEnglishInput("breedEn", breedEn);
//     validateEnglishInput("descriptionEn", descriptionEn);

//     // Validation for Arabic fields
//     validateArabicInput("nameAr", nameAr);
//     validateArabicInput("breedAr", breedAr);
//     validateArabicInput("descriptionAr", descriptionAr);

//     // Check if there are any errors
//     const hasErrors = Object.values(errors).some(error => error !== "");
//     if (hasErrors) {
//       return;
//     }

//     // Create a FormData object
//     const formData = new FormData();
//     formData.append("nameEn", nameEn);
//     formData.append("nameAr", nameAr);
//     formData.append("breedEn", breedEn);
//     formData.append("breedAr", breedAr);
//     formData.append("image", image);
//     formData.append("minWeight", minWeight);
//     formData.append("maxWeight", maxWeight);
//     formData.append("descriptionEn", descriptionEn);
//     formData.append("descriptionAr", descriptionAr);

//     try {
//       // Make a POST request to the server
//       const response = await axios.post(
//         "http://localhost:1995/cat/api/cats",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response.data); // Handle the response as needed
//     } catch (error) {
//       console.error("Error creating cat:", error);
//     }
//   };

//   const handleImageChange = e => {
//     setImage(e.target.files[0]);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-4">
//       <label className="block mb-2">
//         Name (English):
//         <input
//           type="text"
//           value={nameEn}
//           onChange={e => setNameEn(e.target.value)}
//           onBlur={e => validateEnglishInput("nameEn", e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//         {errors.nameEn && (
//           <p className="text-red-500 text-sm">{errors.nameEn}</p>
//         )}
//       </label>
//       <label className="block mb-2">
//         Name (Arabic):
//         <input
//           type="text"
//           value={arabicName}
//           onChange={e => setarabicName(e.target.value)}
//           onBlur={e => validateArabicInput("arabicName", e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//         {errors.arabicName && (
//           <p className="text-red-500 text-sm">{errors.arabicName}</p>
//         )}
//       </label>
//       <label className="block mb-2">
//         Breed (English):
//         <input
//           type="text"
//           value={breedEn}
//           onChange={e => setBreedEn(e.target.value)}
//           onBlur={e => validateEnglishInput("breedEn", e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//         {errors.breedEn && (
//           <p className="text-red-500 text-sm">{errors.breedEn}</p>
//         )}
//       </label>
//       <label className="block mb-2">
//         Breed (Arabic):
//         <input
//           type="text"
//           value={breedAr}
//           onChange={e => setBreedAr(e.target.value)}
//           onBlur={e => validateArabicInput("breedAr", e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//         {errors.breedAr && (
//           <p className="text-red-500 text-sm">{errors.breedAr}</p>
//         )}
//       </label>
//       <label className="block mb-2">
//         Image:
//         <div className="border border-gray-300 rounded px-3 py-2 mt-1 w-full">
//           {image ? (
//             <div className="flex items-center justify-center">
//               <img
//                 src={URL.createObjectURL(image)}
//                 alt="Selected cat"
//                 className="h-32 object-cover"
//               />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center text-gray-400">
//               <span>Drag and drop or click to select an image</span>
//             </div>
//           )}
//         </div>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="hidden"
//         />
//       </label>
//       <label className="block mb-2">
//         Minimum Weight:
//         <input
//           type="number"
//           value={minWeight}
//           onChange={e => setMinWeight(e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//       </label>
//       <label className="block mb-2">
//         Maximum Weight:
//         <input
//           type="number"
//           value={maxWeight}
//           onChange={e => setMaxWeight(e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//       </label>
//       <label className="block mb-2">
//         Description (English):
//         <textarea
//           value={descriptionEn}
//           onChange={e => setDescriptionEn(e.target.value)}
//           onBlur={e => validateEnglishInput("descriptionEn", e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//         {errors.descriptionEn && (
//           <p className="text-red-500 text-sm">{errors.descriptionEn}</p>
//         )}
//       </label>
//       <label className="block mb-2">
//         Description (Arabic):
//         <textarea
//           value={descriptionAr}
//           onChange={e => setDescriptionAr(e.target.value)}
//           onBlur={e => validateArabicInput("descriptionAr", e.target.value)}
//           className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
//         />
//         {errors.descriptionAr && (
//           <p className="text-red-500 text-sm">{errors.descriptionAr}</p>
//         )}
//       </label>
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default CatForm;

import {useState} from "preact/compat";

const CreateCat = ({onCreate}) => {
  const [image, setImage] = useState(null);
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [arabicBreed, setArabicBreed] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [englishBreed, setEnglishBreed] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [errors, setErrors] = useState({});
  const validateEnglishInput = (field, value) => {
    const englishRegex = /^[A-Za-z\s]+$/; // Regular expression to match English characters and spaces
    if (!value) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: "This field cannot be empty.",
      }));
    } else if (!englishRegex.test(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: "Only English characters are allowed.",
      }));
    } else {
      setErrors(prevErrors => ({...prevErrors, [field]: ""}));
    }
  };

  const validateArabicInput = (field, value) => {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/; // Regular expression to match Arabic characters and spaces
    if (!value) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: "This field cannot be empty.",
      }));
    } else if (!arabicRegex.test(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: "Only Arabic characters are allowed.",
      }));
    } else {
      setErrors(prevErrors => ({...prevErrors, [field]: ""}));
    }
  };
  const handleImageUpload = event => {
    const file = event.target.files[0];
    setImage(file);
  };

  const validateWeight = (field, value) => {
    if (!value) {
      return "This field cannot be empty.";
    } else if (isNaN(value)) {
      return "Only numeric values are allowed.";
    } else if (parseFloat(value) <= 0) {
      return "The weight must be greater than zero.";
    }
    return "";
  };

  const handleBlur = (field: string, value: string) => {
    if (field === "englishName") {
      validateEnglishInput(field, value);
    } else if (field === "englishBreed") {
      validateEnglishInput(field, value);
    } else if (field === "arabicName") {
      validateArabicInput(field, value);
    } else if (field === "arabicBreed") {
      validateArabicInput(field, value);
    } else if (field === "arabicDescription") {
      validateArabicInput(field, value);
    } else if (field === "englishDescription") {
      validateEnglishInput(field, value);
    } else if (field === "minWeight" || field === "maxWeight") {
      const error = validateWeight(field, value);
      setErrors(prevErrors => ({...prevErrors, [field]: error}));
    } else {
      setErrors(prevErrors => ({...prevErrors, [field]: ""}));
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    // Validation for English fields
    validateEnglishInput("englishName", englishName);
    validateEnglishInput("englishName", englishName);
    validateEnglishInput("englishDescription", englishDescription);

    // Validation for Arabic fields
    validateArabicInput("arabicName", arabicName);
    validateArabicInput("arabicBreed", arabicBreed);
    validateArabicInput("arabicDescription", arabicDescription);

    // Validation for weight fields
    validateWeight("minWeight", minWeight);
    validateWeight("maxWeight", maxWeight);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== "");
    if (hasErrors) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("min_weight", minWeight);
      formData.append("max_weight", maxWeight);

      const translations = [
        {
          language: "ar",
          name: arabicName,
          breed: arabicBreed,
          description: arabicDescription,
        },
        {
          language: "en",
          name: englishName,
          breed: englishBreed,
          description: englishDescription,
        },
      ];
      formData.append("translations", JSON.stringify(translations));

      const response = await fetch("http://localhost:1995/cat/api/cats", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Reset the form fields
      setImage(null);
      setMinWeight("");
      setMaxWeight("");
      setArabicName("");
      setArabicBreed("");
      setArabicDescription("");
      setEnglishName("");
      setEnglishBreed("");
      setEnglishDescription("");
      setErrors({});
    } catch (error) {
      console.error("Failed to create cat:", error);
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleToggle}
      >
        Add New Pet
      </button>
      
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Create Cat
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCat;
