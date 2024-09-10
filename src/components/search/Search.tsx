import React, { useState } from "react";
import axios from "axios";
import Button from "components/button/Button";

interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groups = ["продукт", "маркетинг", "блок"];

  const validateSearch = () => {
    if (!query.trim()) {
      setError("Пожалуйста, введите строку поиска.");
      return false;
    }
    if (!group) {
      setError("Пожалуйста, выберите категорию для поиска.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSearch = async () => {
    if (!validateSearch()) {
      return;
    }
    setIsSearching(true);

    //изменить API на BACKEND
    try {
      const response = await axios.get<SearchItem[]>(
        "https://api.example.com/search",
        {
          params: {
            q: query,
            group: group,
          },
        }
      );
      setResults(response.data);
    } catch (error) {
      setError("Ошибка при выполнении поиска. Попробуйте снова.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Введите запрос для поиска"
        style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
      />

      <select
        value={group}
        onChange={handleGroupChange}
        style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
      >
        <option value="">Выберите категорию</option>
        {groups.map((group) => (
          <option key={group} value={group}>
            {group.charAt(0).toUpperCase() + group.slice(1)}
          </option>
        ))}
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Button
        name={isSearching ? "Идет поиск..." : "Найти"}
        type="button"
        onClick={handleSearch}
      />

      <div style={{ marginTop: "20px" }}>
        {results.length > 0
          ? results.map((item) => (
              <div
                key={item.id}
                style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
              >
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))
          : !isSearching && <p>Нет результатов для отображения.</p>}
      </div>
    </div>
  );
};

export default Search;
