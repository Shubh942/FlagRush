import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReportCard from "../../components/ReportCard/ReportCard";
import "./Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const pageLoad = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const { data } = await axios.get(
        `https://flagrush-backend-w1n5.onrender.com/api/v1/admin/all-reports`,
        config
      );

      setReports(data.report);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pageLoad();
  }, []);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="reports-title">Reports</h1>
      </div>

      {isLoading ? (
        <div className="reports-loading">Loading reports...</div>
      ) : (
        <div className="reports-grid">
          <AnimatePresence>
            {reports.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="report-card-motion"
              >
                <ReportCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Reports;
