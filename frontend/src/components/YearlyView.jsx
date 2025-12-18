import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const YearlyView = ({ token, monthlyTarget, refreshKey }) => {
  const [monthlySummaries, setMonthlySummaries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchYearlySummary();
  }, [refreshKey]);

  const fetchYearlySummary = async () => {
    try {
      const response = await axios.get(`${API}/income/yearly`, axiosConfig);
      setMonthlySummaries(response.data);
    } catch (error) {
      console.error("Error fetching yearly summary:", error);
    }
  };

  const visibleMonths = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, monthlySummaries.length - visibleMonths);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleSummaries = monthlySummaries.slice(currentIndex, currentIndex + visibleMonths);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Last 12 Months Overview</h2>
        <p className="text-gray-600 mt-1">Scroll to view all months</p>
      </div>

      <div className="relative">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-xl disabled:opacity-30"
            data-testid="yearly-prev-button"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {visibleSummaries.map((summary, index) => (
              <div
                key={`${summary.month}-${summary.year}`}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow"
                data-testid="month-card"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800" data-testid="month-name">
                    {summary.month_name}
                  </h3>
                  <p className="text-sm text-gray-500" data-testid="month-year">{summary.year}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Income</span>
                    <span className="font-semibold text-gray-800" data-testid="month-total">
                      €{summary.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Target</span>
                    <span className="font-semibold text-purple-600" data-testid="month-target">
                      €{summary.target.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span
                      className={`font-semibold ${
                        summary.remaining <= 0 ? 'text-green-600' : 'text-orange-600'
                      }`}
                      data-testid="month-status"
                    >
                      {summary.remaining <= 0 ? '✓ Target Met' : `€${summary.remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} to go`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (summary.total / (summary.target || 1)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center" data-testid="month-progress">
                      {summary.target > 0
                        ? `${Math.round((summary.total / summary.target) * 100)}% of target`
                        : 'No target set'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="rounded-xl disabled:opacity-30"
            data-testid="yearly-next-button"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-purple-500 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              data-testid="dot-indicator"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearlyView;