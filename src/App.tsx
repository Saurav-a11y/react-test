import React, { ChangeEvent, useEffect, useState } from "react";

import { getCountries, getPeople } from "./DataApi";
import { GetCounriesResponse } from "./DataApi/country.interface";
import { GetPeopleResponse, People } from "./DataApi/people.interface";

const getPeopleAge = (dob: string) => {
  const birthDate = new Date(dob);
  const currentData = new Date();

  const ageInMilliseconds = Number(currentData) - Number(birthDate);
  const ageInYears = new Date(ageInMilliseconds).getUTCFullYear() - 1970;

  return ageInYears;
};

function App() {
  const [peopleData, setPeopleData] = useState<GetPeopleResponse | null>(null);
  const [countriesData, setCountriesData] =
    useState<GetCounriesResponse | null>(null);

  const [searchKeyword, setSearchKeyword] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = setTimeout(() => {
      setSearchKeyword(e.target.value);
    }, 300);

    return () => clearTimeout(searchValue);
  };

  useEffect(() => {
    const searchCountries = async (search?: string) => {
      const result = await getCountries({ search });
      setCountriesData(result);
    };
    searchCountries();
  }, []);

  useEffect(() => {
    const searchPeople = async (search?: string) => {
      const result = await getPeople({ search });
      setPeopleData(result);
    };

    searchPeople(searchKeyword);
  }, [searchKeyword]);

  return (
    <div className="pageWrapper">
      <p>Search Component</p>
      <input onChange={handleChange} />
      <p>List Component</p>
      <div className="listWrapper">
        {peopleData?.searchResults?.map((item: People, idx: number) => {
          let country = countriesData?.searchResults?.find(
            (data: { alpha2Code: string }) => data.alpha2Code === item.country
          );
          return (
            <div key={idx}>
              <p> Full Name: {`${item.first_name} ${item.last_name}`} </p>
              <p> Age: {getPeopleAge(item.date_of_birth)} </p>
              <p>Country: {country?.name} </p>
            </div>
          );
        })}
      </div>
      <p>Found results: {peopleData?.searchResultCount}</p>
      <p>Total results: {peopleData?.totalResultCounter} </p>
    </div>
  );
}

export default App;
