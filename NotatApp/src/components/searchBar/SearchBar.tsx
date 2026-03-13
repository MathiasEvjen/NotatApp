import { useState } from "react";
import "./searchBar.css";
import { IoSearch } from "react-icons/io5";

const SearchBar: React.FC = () => {

    const [query, setQuery] = useState<string>("");

    return(
        <div className="search-bar-container">
            <div className="search-bar">
                <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a document..." />
                <IoSearch />
            </div>
        </div>
    )
};

export default SearchBar;