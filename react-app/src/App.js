import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, [sortBy, sortDirection]); // Fetch data when sorting changes

  useEffect(() => {
    fetchData();
  }, [currentPage, sortBy]); // Fetch data when currentPage or sortBy changes

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/?page=${currentPage}&sortBy=${sortBy}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const paginateData = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    setSortedData(paginatedData);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortBy = (option) => {
    if (option === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  const renderTableData = () => {
    let filteredData = data.filter(
      (item) =>
        item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    filteredData = filteredData.slice(startIndex, endIndex);

    if (sortBy === "date") {
      filteredData.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (sortBy === "time") {
      filteredData.sort((a, b) => {
        const timeA = moment(a.created_at).format("HH:mm:ss");
        const timeB = moment(b.created_at).format("HH:mm:ss");
        return timeA.localeCompare(timeB);
      });
    }

    if (sortDirection === "asc") {
      filteredData.reverse();
    }

    return filteredData.map((item) => (
      <>
        <div className="container">
          <table className="tv">
            <tr key={item.sno}>
              <td>{item.customer_name}</td>
              <td>{item.age}</td>
              <td>{item.phone}</td>
              <td>{item.location}</td>
              <td>{moment(item.created_at).format("YYYY-MM-DD")}</td>
              <td>{moment(item.created_at).format("HH:mm:ss")}</td>
            </tr>
          </table>
        </div>
      </>
    ));
  };

  const totalPages = Math.ceil(data.length / recordsPerPage);

  return (
    <div className="">
      <h1 className="header">Customer Data</h1>
      <div className="s">
        <input
          className="in"
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="btns">
          <div className="b1">
            <button onClick={() => handleSortBy("date")}>Sort by Date</button>
          </div>
          <div className="b2">
            <button onClick={() => handleSortBy("time")}>Sort by Time</button>
          </div>
        </div>
      </div>
      <div className="th">
        <ul className="lis">
          <li>Name</li>
          <li>Age</li>
          <li>Phone</li>
          <li className="loc">Location</li>
          <li className="dat">Date</li>
          <li className="tim">Time</li>
        </ul>
      </div>
      <table className="table">
        <tbody className="tb">{renderTableData()}</tbody>
      </table>
      <div className="foot">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className="fbut"
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
