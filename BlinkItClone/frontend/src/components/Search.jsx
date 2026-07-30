import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [value, setValue] = useState(query);

  const goToSearchPageHandler = () => {
    if (!isSearchPage) {
      navigate("/search");
    }
  };

  const handleSearch = () => {
    if (!value.trim()) return;
    navigate(`/search?q=${value}`);
  };

  return (
    <div className="w-2/4">
      <div className="group relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onClick={goToSearchPageHandler}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="focus:border-primary-200 w-full rounded-full border bg-white px-4 py-2 pr-10 outline-none"
        />

        {!isSearchPage && !value && (
          <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
            <TypeAnimation
              sequence={[
                `Search "milk"...`,
                1000,
                `Search "bread"...`,
                1000,
                `Search "paneer"...`,
                1000,
                `Search "vegetables"...`,
                1000,
                `Search "fruits"...`,
                1000,
              ]}
              speed={40}
              repeat={Infinity}
            />
          </div>
        )}

        <button
          onClick={handleSearch}
          className="group-focus-within:text-primary-200 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        >
          <IoSearch size={20} />
        </button>
      </div>
    </div>
  );
}

export default Search;
