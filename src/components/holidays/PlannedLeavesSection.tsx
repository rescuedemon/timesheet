import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface PlannedLeave {
  id: string;
  name: string;
  employee: string;
  startDate: string;
  endDate: string;
}

interface PlannedLeavesSectionProps {
  plannedLeaves: PlannedLeave[];
  containerBgColor: string;
  containerTextColor: string;
  isAddingLeave: boolean;
  setIsAddingLeave: React.Dispatch<React.SetStateAction<boolean>>;
  newLeave: { name: string; employee: string; startDate: string; endDate: string };
  setNewLeave: React.Dispatch<React.SetStateAction<{ name: string; employee: string; startDate: string; endDate: string }>>;
  handleAddPlannedLeave: () => void;
  handleRemovePlannedLeave: (leaveId: string) => void;
}

const PlannedLeavesSection: React.FC<PlannedLeavesSectionProps> = ({
  plannedLeaves,
  containerBgColor,
  containerTextColor,
  isAddingLeave,
  setIsAddingLeave,
  newLeave,
  setNewLeave,
  handleAddPlannedLeave,
  handleRemovePlannedLeave
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ backgroundColor: containerBgColor }}>
        <h3 className="text-lg font-bold" style={{ color: containerTextColor }}>Planned Leaves</h3>
        <Dialog open={isAddingLeave} onOpenChange={setIsAddingLeave}>
          <DialogTrigger asChild>
            <button className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-1">
              <Plus size={14} />
              Add Leave
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle className="font-bold">Add Planned Leave</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="leave-name" className="font-semibold">Leave Name</Label>
                <Input
                  id="leave-name"
                  value={newLeave.name}
                  onChange={(e) => setNewLeave({...newLeave, name: e.target.value})}
                  placeholder="e.g., Annual Leave"
                  className="font-medium"
                />
              </div>
              <div>
                <Label htmlFor="employee" className="font-semibold">Employee</Label>
                <Input
                  id="employee"
                  value={newLeave.employee}
                  onChange={(e) => setNewLeave({...newLeave, employee: e.target.value})}
                  placeholder="Employee name"
                  className="font-medium"
                />
              </div>
              <div>
                <Label htmlFor="startDate" className="font-semibold">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                  className="font-medium"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="font-semibold">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                  className="font-medium"
                />
              </div>
              <Button
                onClick={handleAddPlannedLeave}
                className="w-full bg-green-600 hover:bg-green-700 font-semibold"
              >
                Add Leave
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-6">
        {plannedLeaves.length > 0 ? (
          plannedLeaves.map(leave => (
            <div key={leave.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h4 className="font-bold text-gray-900">{leave.name}</h4>
                <p className="text-sm font-medium text-gray-600">
                  {leave.employee} • {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                onClick={() => handleRemovePlannedLeave(leave.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📅</div>
            <p className="font-medium text-gray-900">No planned leaves added yet</p>
            <p className="text-sm font-medium text-gray-600">Click "Add Leave" to create one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannedLeavesSection;