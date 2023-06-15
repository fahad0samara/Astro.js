import React, {useState, useEffect} from "react";
import axios from "axios";

const CatsList = () => {
  const [cats, setCats] = useState([]);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    fetchCats();
  }, [language]);

  const fetchCats = async () => {
    try {
      const response = await axios.get("http://localhost:1995/cat/api/cats", {
        params: {lang: language},
      });
      setCats(response.data);
    } catch (error) {
      console.error("Error fetching cats:", error);
    }
  };

  const handleLanguageChange = selectedLanguage => {
    setLanguage(selectedLanguage);
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange("en")}>English</button>
      <button onClick={() => handleLanguageChange("ar")}>Arabic</button>

      <h1>Cats List</h1>
      {cats.map(cat => (
        <div key={cat._id}>
          <h2>Name: {cat.name}</h2>
          <h3>Breed: {cat.breed}</h3>
          <p>Description: {cat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CatsList;
