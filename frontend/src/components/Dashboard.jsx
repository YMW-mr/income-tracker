import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Plus, Target, TrendingUp, Calendar, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthlyView from "@/components/MonthlyView";
import YearlyView from "@/components/YearlyView";

const Dashboard = ({ user, token, onLogout }) => {
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [newTarget, setNewTarget] = useState("");
  const [ytdTotal, setYtdTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = useState(0);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchTarget();
    fetchYTD();
  }, [refreshKey]);

  const fetchTarget = async () => {
    try {
      const response = await axios.get(`${API}/target`, axiosConfig);
      setMonthlyTarget(response.data.monthly_target);
    } catch (error) {
      if (error.response?.status === 404) {
        setMonthlyTarget(0);
      }
    }
  };

  const fetchYTD = async () => {
    try {
      const response = await axios.get(`${API}/income/ytd`, axiosConfig);
      setYtdTotal(response.data.ytd_total);
      setCurrentYear(response.data.year);
    } catch (error) {
      console.error("Error fetching YTD:", error);
    }
  };

  const handleSetTarget = async () => {
    if (!newTarget || parseFloat(newTarget) <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }

    try {
      await axios.post(
        `${API}/target`,
        { monthly_target: parseFloat(newTarget) },
        axiosConfig
      );
      toast.success("Monthly target updated!");
      setTargetDialogOpen(false);
      setNewTarget("");
      fetchTarget();
    } catch (error) {
      toast.error("Failed to update target");
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Income Tracker</h1>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={targetDialogOpen} onOpenChange={setTargetDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl border-purple-200 hover:bg-purple-50"
                    data-testid="set-target-button"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Set Target</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Set Monthly Target</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="target">Monthly Income Target</Label>
                      <Input
                        id="target"
                        type="number"
                        placeholder="5000"
                        value={newTarget}
                        onChange={(e) => setNewTarget(e.target.value)}
                        className="rounded-xl mt-2"
                        data-testid="target-input"
                      />
                    </div>
                    <Button
                      onClick={handleSetTarget}
                      className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl"
                      data-testid="save-target-button"
                    >
                      Save Target
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={onLogout}
                className="rounded-xl border-gray-200 hover:bg-gray-50"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* YTD Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-xl p-6 sm:p-8 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <p className="text-sm sm:text-base font-medium opacity-90">Year to Date ({currentYear})</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold" data-testid="ytd-total">
              €{ytdTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/60 backdrop-blur-md rounded-2xl p-1">
            <TabsTrigger value="monthly" className="rounded-xl data-[state=active]:bg-white" data-testid="monthly-tab">
              <Calendar className="w-4 h-4 mr-2" />
              Monthly View
            </TabsTrigger>
            <TabsTrigger value="yearly" className="rounded-xl data-[state=active]:bg-white" data-testid="yearly-tab">
              <TrendingUp className="w-4 h-4 mr-2" />
              12-Month View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <MonthlyView
              token={token}
              monthlyTarget={monthlyTarget}
              onRefresh={handleRefresh}
              refreshKey={refreshKey}
            />
          </TabsContent>

          <TabsContent value="yearly">
            <YearlyView token={token} monthlyTarget={monthlyTarget} refreshKey={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;