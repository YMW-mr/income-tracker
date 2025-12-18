import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const MonthlyView = ({ token, monthlyTarget, onRefresh, refreshKey }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ total: 0, target: 0, remaining: 0 });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: "",
    source: "",
  });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchData();
  }, [currentMonth, currentYear, refreshKey]);

  const fetchData = async () => {
    try {
      // Fetch entries
      const entriesResponse = await axios.get(
        `${API}/income?month=${currentMonth}&year=${currentYear}`,
        axiosConfig
      );
      setEntries(entriesResponse.data);

      // Fetch summary
      const summaryResponse = await axios.get(
        `${API}/income/monthly-summary?month=${currentMonth}&year=${currentYear}`,
        axiosConfig
      );
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.amount || !newEntry.source || !newEntry.date) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        `${API}/income`,
        {
          date: newEntry.date,
          amount: parseFloat(newEntry.amount),
          source: newEntry.source,
        },
        axiosConfig
      );
      toast.success("Income added!");
      setAddDialogOpen(false);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        source: "",
      });
      fetchData();
      onRefresh();
    } catch (error) {
      toast.error("Failed to add income");
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(`${API}/income/${entryId}`, axiosConfig);
      toast.success("Entry deleted");
      fetchData();
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl p-4">
        <Button
          variant="ghost"
          onClick={() => navigateMonth(-1)}
          className="rounded-xl"
          data-testid="prev-month-button"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800" data-testid="current-month-year">
          {monthNames[currentMonth - 1]} {currentYear}
        </h2>
        <Button
          variant="ghost"
          onClick={() => navigateMonth(1)}
          className="rounded-xl"
          data-testid="next-month-button"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Total Income</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800" data-testid="monthly-total">
            €{summary.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Target</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600" data-testid="monthly-target">
            €{summary.target.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Remaining</p>
          <p
            className={`text-2xl sm:text-3xl font-bold ${
              summary.remaining < 0 ? 'text-green-600' : 'text-orange-600'
            }`}
            data-testid="monthly-remaining"
          >
            €{Math.abs(summary.remaining).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            {summary.remaining < 0 ? ' over' : ''}
          </p>
        </div>
      </div>

      {/* Add Entry Button */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl py-6 shadow-lg"
            data-testid="add-income-button"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Income Entry
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Income Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="rounded-xl mt-2"
                data-testid="entry-date-input"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="500.00"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                className="rounded-xl mt-2"
                data-testid="entry-amount-input"
              />
            </div>
            <div>
              <Label htmlFor="source">Source (abbreviated)</Label>
              <Input
                id="source"
                type="text"
                placeholder="e.g., Client A, Salary, etc."
                value={newEntry.source}
                onChange={(e) => setNewEntry({ ...newEntry, source: e.target.value })}
                className="rounded-xl mt-2"
                data-testid="entry-source-input"
              />
            </div>
            <Button
              onClick={handleAddEntry}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl"
              data-testid="save-entry-button"
            >
              Add Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Entries Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="income-entries-table">
            <thead className="bg-purple-100/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No income entries for this month yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100 hover:bg-purple-50/30" data-testid="income-entry-row">
                    <td className="px-4 py-3 text-sm text-gray-700" data-testid="entry-date">{entry.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700" data-testid="entry-source">{entry.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium" data-testid="entry-amount">
                      €{entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        data-testid="delete-entry-button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;