import { useState, useMemo } from "react";
import { NextPage } from "next";

import Layout from "../components/layout";
import useApiData from "../hooks/use-api-data";
import Airport from "../types/airport";

const Page: NextPage = () => {
  const {
    data: airports,
    isLoading,
    isError,
  } = useApiData<Airport[]>("/api/airports", []);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const airportsSearchIndex = useMemo(() => {
    const index: string[] = [];
    airports.forEach(({ iata, name, city, country }) => {
      index.push(
        `${iata.toLowerCase()}:${name.toLowerCase()}:${city.toLowerCase()}:${country.toLowerCase()}`
      );
    });
    return index;
  }, [airports]);

  const filteredAirports: Airport[] = useMemo(() => {
    if (!searchTerm) {
      return airports;
    }

    const searchTermLower = searchTerm.toLowerCase();
    return airportsSearchIndex
      .filter((index) => {
        return index.includes(searchTermLower);
      })
      .map((index) => {
        const [iata] = index.split(":");
        return airports.find(
          (airport) => airport.iata.toLowerCase() === iata
        ) as Airport;
      });
  }, [searchTerm, airports]);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return <h2 className="mt-10 text-xl mb-5">Loading...</h2>;
    }

    if (isError) {
      return (
        <h2 className="mt-10 text-xl mb-5">
          Something went wrong... Please try refreshing the page.
        </h2>
      );
    }

    if (!filteredAirports.length) {
      return (
        <h2 className="mt-10 text-xl mb-5">
          No airports found
          <div className="rounded-full bg-gray-500 text-white text-xs fw-bold py-1 px-3 inline ml-3">
            0
          </div>
        </h2>
      );
    }

    return (
      <>
        <h2 className="mt-10 text-xl mb-5">
          All Airports
          <div className="rounded-full bg-sky-500 text-white text-xs fw-bold py-1 px-3 inline ml-3">
            {filteredAirports.length}
          </div>
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          {filteredAirports.map((airport) => (
            <a
              href={`/airports/${airport.iata.toLowerCase()}`}
              key={airport.iata}
              className="shadow p-5 border rounded-lg"
            >
              <div className="mb-2">
                {airport.name}, {airport.city} - {airport.iata}
              </div>
              <div className="text-gray-600 text-sm">{airport.country}</div>
            </a>
          ))}
        </div>
      </>
    );
  }, [filteredAirports, isLoading, isError]);

  return (
    <Layout>
      <h1 className="text-2xl mb-5">DBL Code Challenge: Airports</h1>
      <form action="">
        <input
          type="text"
          name="iata"
          placeholder="Start typing..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="shadow border rounded-lg p-5 w-full bg-gray-50 focus:bg-white focus:outline-sky-500"
        />
      </form>
      {renderContent}
    </Layout>
  );
};

export default Page;
