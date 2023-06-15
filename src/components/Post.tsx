import React, {useState} from "react";
import axios from "axios";

const CatForm = () => {
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [breedEn, setBreedEn] = useState("");
  const [breedAr, setBreedAr] = useState("");
  const [image, setImage] = useState("");
  const [minWeight, setMinWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(0);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    // Create the cat object
    const catData = {
      name: nameEn,
      nameAr,
      breed: breedEn,
      breedAr,
      image,
      minWeight,
      maxWeight,
      description: descriptionEn,
      descriptionAr,
    };

    try {
      // Make a POST request to the server
      const response = await axios.post(
        "http://localhost:1995/cat/api/cats",
        catData
      );
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error("Error creating cat:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name (English):
        <input
          type="text"
          value={nameEn}
          onChange={e => setNameEn(e.target.value)}
        />
      </label>
      <br />
      <label>
        Name (Arabic):
        <input
          type="text"
          value={nameAr}
          onChange={e => setNameAr(e.target.value)}
        />
      </label>
      <br />
      <label>
        Breed (English):
        <input
          type="text"
          value={breedEn}
          onChange={e => setBreedEn(e.target.value)}
        />
      </label>
      <br />
      <label>
        Breed (Arabic):
        <input
          type="text"
          value={breedAr}
          onChange={e => setBreedAr(e.target.value)}
        />
      </label>
      <br />
      <label>
        Image URL:
        <input
          type="text"
          value={image}
          onChange={e => setImage(e.target.value)}
        />
      </label>
      <br />
      <label>
        Minimum Weight:
        <input
          type="number"
          value={minWeight}
          onChange={e => setMinWeight(e.target.value)}
        />
      </label>
      <br />
      <label>
        Maximum Weight:
        <input
          type="number"
          value={maxWeight}
          onChange={e => setMaxWeight(e.target.value)}
        />
      </label>
      <br />
      <label>
        Description (English):
        <textarea
          value={descriptionEn}
          onChange={e => setDescriptionEn(e.target.value)}
        />
      </label>
      <br />
      <label>
        Description (Arabic):
        <textarea
          value={descriptionAr}
          onChange={e => setDescriptionAr(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CatForm;
