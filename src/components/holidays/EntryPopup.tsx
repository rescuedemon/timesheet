import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Pin, CheckSquare, Star } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type EntryType = 'Diary' | 'Reminder' | 'Note to Self' | 'Meeting Notes' | 'Idea' | 'Journal' | 'To-Do List' | 'Gratitude Log' | 'Dream Log' | 'Mood Tracker';

interface ReminderSettings {
  time: Date;
  recurrence?: 'daily' | 'weekly' | 'monthly';
}

interface Entry {
  id: string;
  content: string;
  type: EntryType;
  date: Date;
  reminders?: ReminderSettings;
  completed?: boolean;
  pinned?: boolean;
  archived?: boolean;
  mood?: string;
  tags?: string[];
  attachments?: string[];
  tasks?: Task[];
  gratitude?: string[];
}

interface EntryPopupProps {
  date: Date;
  entries: Entry[];
  saveEntry: (content: string, type: EntryType, date: Date, reminders?: ReminderSettings, mood?: string, tasks?: Task[], gratitude?: string[]) => Promise<string>;
  deleteEntry: (id: string) => Promise<void>;
  updateEntry: (id: string, updatedFields: Partial<Entry>) => Promise<void>;
  editingEntry: Entry | null;
  setEditingEntry: React.Dispatch<React.SetStateAction<Entry | null>>;
  isSameDay: (date1: Date, date2: Date) => boolean;
}

const journalPrompts = [
  "What was the highlight of your day?",
  "What are you grateful for today?",
  "What did you learn today?",
  "What made you smile today?",
  "What would you do differently if you could relive today?",
  "What are your intentions for tomorrow?",
];

const moodOptions = [
  { value: 'happy', label: '😊 Happy' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'energized', label: '💪 Energized' },
  { value: 'tired', label: '😴 Tired' },
  { value: 'stressed', label: '😫 Stressed' },
  { value: 'calm', label: '😌 Calm' },
  { value: 'excited', label: '🤩 Excited' },
  { value: 'anxious', label: '😰 Anxious' },
];

const EntryPopup: React.FC<EntryPopupProps> = ({
  date,
  entries,
  saveEntry,
  deleteEntry,
  updateEntry,
  editingEntry,
  setEditingEntry,
  isSameDay
}) => {
  const [newEntry, setNewEntry] = useState({ 
    content: '', 
    type: 'Diary' as EntryType, 
    reminderTime: '',
    recurrence: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    mood: '',
    gratitude: ['', '', ''],
    tasks: [{ id: Date.now().toString(), text: '', completed: false }],
  });
  
  const [journalPrompt] = useState(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  const dayEntries = entries.filter(entry => isSameDay(entry.date, date) && !entry.archived).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const [viewMode, setViewMode] = useState<'view' | 'create' | 'edit'>('view');

  const handleSaveEntry = async () => {
    // Allow saving without content for To-Do List and Reminder types
    const canSave = newEntry.content.trim() !== '' || 
                    newEntry.type === 'To-Do List' || 
                    newEntry.type === 'Reminder';
    
    if (canSave) {
      const reminders = newEntry.reminderTime ? { 
        time: new Date(newEntry.reminderTime),
        recurrence: newEntry.recurrence !== 'none' ? newEntry.recurrence : undefined
      } : undefined;
      
      const gratitude = newEntry.gratitude.filter(item => item.trim() !== '');
      
      if (editingEntry) {
        await updateEntry(editingEntry.id, {
          content: newEntry.content,
          type: newEntry.type,
          reminders,
          mood: newEntry.mood,
          tasks: newEntry.tasks.filter(task => task.text.trim() !== ''),
          gratitude
        });
        setEditingEntry(null);
      } else {
        await saveEntry(
          newEntry.content, 
          newEntry.type, 
          date, 
          reminders, 
          newEntry.mood,
          newEntry.tasks.filter(task => task.text.trim() !== ''),
          gratitude
        );
      }
      
      setNewEntry({ 
        content: '', 
        type: 'Diary', 
        reminderTime: '',
        recurrence: 'none',
        mood: '',
        gratitude: ['', '', ''],
        tasks: [{ id: Date.now().toString(), text: '', completed: false }],
      });
      setViewMode('view');
    }
  };

  const handleEditEntry = (entry: Entry) => {
    setNewEntry({
      content: entry.content,
      type: entry.type,
      reminderTime: entry.reminders?.time ? entry.reminders.time.toISOString().slice(0, 16) : '',
      recurrence: entry.reminders?.recurrence || 'none',
      mood: entry.mood || '',
      gratitude: entry.gratitude || ['', '', ''],
      tasks: entry.tasks || [{ id: Date.now().toString(), text: '', completed: false }],
    });
    setEditingEntry(entry);
    setViewMode('edit');
  };

  const handleAddTask = () => {
    setNewEntry({
      ...newEntry,
      tasks: [...newEntry.tasks, { id: Date.now().toString(), text: '', completed: false }]
    });
  };

  const handleTaskChange = (id: string, text: string) => {
    setNewEntry({
      ...newEntry,
      tasks: newEntry.tasks.map(task => 
        task.id === id ? { ...task, text } : task
      )
    });
  };

  const handleTaskToggle = (id: string) => {
    setNewEntry({
      ...newEntry,
      tasks: newEntry.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const handleRemoveTask = (id: string) => {
    setNewEntry({
      ...newEntry,
      tasks: newEntry.tasks.filter(task => task.id !== id)
    });
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const updatedGratitude = [...newEntry.gratitude];
    updatedGratitude[index] = value;
    setNewEntry({ ...newEntry, gratitude: updatedGratitude });
  };

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in { animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .entry-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .entry-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .mood-selector {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mood-selector:hover {
          transform: scale(1.05);
        }
        .gradient-bg {
          background: linear-gradient(135deg, #000000 0%, #333333 100%);
        }
        .soft-shadow {
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .save-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
      `}</style>
      
      <DialogContent className="sm:max-w-5xl bg-white text-gray-800 rounded-3xl shadow-2xl p-0 max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Beautiful Header */}
        <div className="gradient-bg p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-full animate-bounce-in">
                <Star size={24} className="text-white" />
              </div>
              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </DialogTitle>
            <p className="text-white/80 text-sm">
              {dayEntries.length > 0 
                ? `${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'} for today`
                : 'Start writing your first entry for today'
              }
            </p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {viewMode === 'view' && (
            <div className="space-y-6 animate-fade-in">
              {/* Existing Entries */}
              {dayEntries.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Journal</h3>
                  {dayEntries.map((entry, index) => (
                    <div key={entry.id} 
                         className="entry-card bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 soft-shadow"
                         style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold bg-gradient-to-r from-gray-800 to-black text-white px-3 py-1.5 rounded-full">
                            {entry.type}
                          </span>
                          {entry.mood && (
                            <span className="text-lg bg-white px-3 py-1 rounded-full shadow-sm border">
                              {moodOptions.find(m => m.value === entry.mood)?.label}
                            </span>
                          )}
                          {entry.pinned && (
                            <div className="p-1.5 bg-yellow-100 rounded-full">
                              <Pin size={16} className="text-yellow-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200 hover:scale-110"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {entry.content && <p className="text-gray-700 mb-4 leading-relaxed">{entry.content}</p>}
                      
                      {entry.tasks && entry.tasks.length > 0 && (
                        <div className="space-y-3 mt-4">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <CheckSquare size={16} className="text-green-600" />
                            Tasks
                          </h4>
                          <div className="space-y-2">
                            {entry.tasks.map((task) => (
                              <div key={task.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => {
                                    const updatedTasks = entry.tasks?.map(t => 
                                      t.id === task.id ? { ...t, completed: !t.completed } : t
                                    );
                                    updateEntry(entry.id, { tasks: updatedTasks });
                                  }}
                                  className="h-5 w-5 text-green-600 rounded focus:ring-green-500 transition-all duration-200"
                                />
                                <span className={`transition-all duration-300 ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                  {task.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {entry.gratitude && entry.gratitude.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Star size={16} className="text-yellow-600" />
                            Gratitude
                          </h4>
                          <ul className="space-y-2">
                            {entry.gratitude.map((item, index) => (
                              <li key={index} className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Beautiful Add Entry Button */}
              <div className="text-center pt-6">
                <button
                  onClick={() => setViewMode('create')}
                  className="group bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <div className="p-1 bg-white/20 rounded-full group-hover:rotate-90 transition-transform duration-300">
                    <Plus size={20} />
                  </div>
                  Write New Entry
                </button>
              </div>

              {dayEntries.length === 0 && (
                <div className="text-center py-12 animate-fade-in">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Your journal awaits</h3>
                  <p className="text-gray-500 mb-8">Start capturing today's moments and thoughts</p>
                </div>
              )}
            </div>
          )}

          {(viewMode === 'create' || viewMode === 'edit') && (
            <div className="space-y-8 animate-slide-in">
              {/* Journal Prompt */}
              {newEntry.type === 'Diary' && viewMode === 'create' && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-xl shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-full">
                      <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        <span className="font-semibold">💡 Journal Prompt:</span> {journalPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Entry Type & Mood Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="entry-type" className="text-sm font-semibold text-gray-700">Entry Type</Label>
                  <Select
                    value={newEntry.type}
                    onValueChange={(value) => setNewEntry({ ...newEntry, type: value as EntryType })}
                  >
                    <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-gray-500 transition-all duration-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-lg border-2">
                      <SelectItem value="Diary" className="rounded-lg m-1 p-3">📓 Diary</SelectItem>
                      <SelectItem value="Note to Self" className="rounded-lg m-1 p-3">💭 Note to Self</SelectItem>
                      <SelectItem value="To-Do List" className="rounded-lg m-1 p-3">✅ To-Do List</SelectItem>
                      <SelectItem value="Reminder" className="rounded-lg m-1 p-3">⏰ Reminder</SelectItem>
                      <SelectItem value="Gratitude Log" className="rounded-lg m-1 p-3">🌟 Gratitude Log</SelectItem>
                      <SelectItem value="Journal" className="rounded-lg m-1 p-3">📖 Journal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Mood Tracker */}
                {newEntry.type === 'Diary' && (
                  <div className="space-y-3">
                    <Label htmlFor="mood" className="text-sm font-semibold text-gray-700">Today's Mood</Label>
                    <Select
                      value={newEntry.mood}
                      onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}
                    >
                      <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-400 rounded-xl focus:ring-2 focus:ring-gray-500 transition-all duration-200 mood-selector">
                        <SelectValue placeholder="How are you feeling?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-lg border-2">
                        {moodOptions.map(mood => (
                          <SelectItem key={mood.value} value={mood.value} className="rounded-lg m-1 p-3 hover:bg-gray-50">
                            {mood.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {/* Main Content Area */}
              {(newEntry.type !== 'To-Do List' && newEntry.type !== 'Reminder') && (
                <div className="space-y-3">
                  <Label htmlFor="content" className="text-sm font-semibold text-gray-700">Your Thoughts</Label>
                  <div className="relative">
                    <textarea
                      id="content"
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      placeholder="Write freely about your day, thoughts, and feelings..."
                      className="w-full h-48 p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-all duration-200 text-gray-700 leading-relaxed"
                      style={{ minHeight: '12rem' }}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                      {newEntry.content.length} characters
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Content for To-Do List and Reminder */}
              {(newEntry.type === 'To-Do List' || newEntry.type === 'Reminder') && (
                <div className="space-y-3">
                  <Label htmlFor="content" className="text-sm font-semibold text-gray-700">
                    Description <span className="text-xs text-gray-500">(optional)</span>
                  </Label>
                  <div className="relative">
                    <textarea
                      id="content"
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      placeholder="Add any additional notes or context..."
                      className="w-full h-32 p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-all duration-200 text-gray-700 leading-relaxed"
                    />
                  </div>
                </div>
              )}
              
              {/* To-Do List */}
              {newEntry.type === 'To-Do List' && (
                <div className="space-y-4 bg-green-50 p-6 rounded-2xl border border-green-200">
                  <Label className="text-sm font-semibold text-green-800 flex items-center gap-2">
                    <CheckSquare size={16} />
                    Today's Tasks
                  </Label>
                  <div className="space-y-3">
                    {newEntry.tasks.map((task) => (
                       <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-green-100 transition-all duration-500 ease-out" data-task-id={task.id}>
                         <input
                           type="checkbox"
                           checked={task.completed}
                           onChange={() => handleTaskToggle(task.id)}
                           className="h-5 w-5 text-green-600 rounded focus:ring-green-500 transition-all duration-300 ease-out"
                         />
                         <input
                           type="text"
                           value={task.text}
                           onChange={(e) => handleTaskChange(task.id, e.target.value)}
                           placeholder="Add a task..."
                           className={`flex-1 p-2 border-0 focus:outline-none bg-transparent transition-all duration-300 ease-out ${task.completed ? 'line-through opacity-60 text-gray-500' : 'text-gray-700'}`}
                         />
                        <button
                          onClick={() => handleRemoveTask(task.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddTask}
                      className="flex items-center gap-2 text-green-600 hover:text-green-800 mt-2 p-2 hover:bg-green-100 rounded-lg transition-all duration-200"
                    >
                      <Plus size={16} /> Add Task
                    </button>
                  </div>
                </div>
              )}
              
              {/* Gratitude Log */}
              {newEntry.type === 'Gratitude Log' && (
                <div className="space-y-4 bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
                  <Label className="text-sm font-semibold text-yellow-800 flex items-center gap-2">
                    <Star size={16} />
                    Today I'm grateful for...
                  </Label>
                  {newEntry.gratitude.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Star size={16} className="text-yellow-600" />
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleGratitudeChange(index, e.target.value)}
                        placeholder={`Grateful thing #${index + 1}`}
                        className="flex-1 p-3 border-2 border-yellow-200 rounded-xl focus:outline-none focus:border-yellow-400 bg-white transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Reminder Settings */}
              {newEntry.type === 'Reminder' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <div>
                    <Label htmlFor="reminder-time" className="text-sm font-semibold text-blue-800">Remind me at</Label>
                    <Input
                      type="datetime-local"
                      id="reminder-time"
                      value={newEntry.reminderTime}
                      onChange={(e) => setNewEntry({ ...newEntry, reminderTime: e.target.value })}
                      className="w-full mt-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recurrence" className="text-sm font-semibold text-blue-800">Repeat</Label>
                    <Select
                      value={newEntry.recurrence}
                      onValueChange={(value) => setNewEntry({ ...newEntry, recurrence: value as any })}
                    >
                      <SelectTrigger className="w-full mt-2 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Does not repeat" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="none">Does not repeat</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSaveEntry}
                  className="flex-1 save-button bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
                <button
                  onClick={() => {
                    setViewMode('view');
                    setEditingEntry(null);
                    setNewEntry({ 
                      content: '', 
                      type: 'Diary', 
                      reminderTime: '',
                      recurrence: 'none',
                      mood: '',
                      gratitude: ['', '', ''],
                      tasks: [{ id: Date.now().toString(), text: '', completed: false }],
                    });
                  }}
                  className="px-6 py-4 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 rounded-2xl font-semibold transition-all duration-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </>
  );
};

export default EntryPopup;