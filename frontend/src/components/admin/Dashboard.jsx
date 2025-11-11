import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { routineService } from '../../services/routineService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    loadStudents();
    loadRoutinesByDate();
  }, [selectedDate]);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    }
  };

  const loadRoutinesByDate = async () => {
    try {
      const data = await routineService.getRoutinesByDate(selectedDate);
      setRoutines(data);
    } catch (error) {
      toast.error('Failed to load routines');
    }
  };

  const handleAddFeedback = async () => {
    if (!feedback.trim()) return;
    
    setSubmittingFeedback(true);
    try {
      await routineService.addFeedback(selectedRoutine.id, feedback);
      toast.success('Feedback added successfully!');
      setFeedback('');
      loadRoutinesByDate();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to add feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Today's Routines</h3>
            <p className="text-3xl font-bold text-green-600">{routines.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900">Completion Rate</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {students.length > 0 ? Math.round((routines.length / students.length) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Students Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Routine Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const hasRoutine = routines.some(r => r.student.id === student.id);
                return (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.classGrade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.parent?.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasRoutine ? (
                        <button
                          onClick={() => {
                            const routine = routines.find(r => r.student.id === student.id);
                            setSelectedRoutine(routine);
                            setFeedback(routine.adminFeedback || '');
                            setShowModal(true);
                          }}
                          className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                        >
                          {routines.find(r => r.student.id === student.id)?.adminFeedback ? 'View & Edit' : 'View Routine'}
                        </button>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Routine Modal */}
      {showModal && selectedRoutine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedRoutine.student.name}'s Routine - {new Date(selectedRoutine.routineDate).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Wake Up:</strong> {selectedRoutine.wakeUpTime || 'N/A'}</div>
              <div><strong>School Time:</strong> {selectedRoutine.schoolTime || 'N/A'}</div>
              <div><strong>Breakfast Time:</strong> {selectedRoutine.breakfastTime || 'N/A'}</div>
              <div><strong>Lunch Time:</strong> {selectedRoutine.lunchTime || 'N/A'}</div>
              <div><strong>Nap Time:</strong> {selectedRoutine.napTime || 'N/A'}</div>
              <div><strong>Dinner Time:</strong> {selectedRoutine.dinnerTime || 'N/A'}</div>
              <div><strong>Sleep Time:</strong> {selectedRoutine.sleepTime || 'N/A'}</div>
              <div><strong>Screen Time:</strong> {selectedRoutine.screenTimeMinutes || 0} min</div>
              <div><strong>Study Time:</strong> {selectedRoutine.studyTimeMinutes || 0} min</div>
              <div>
                <strong>Behavior:</strong> 
                <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                  selectedRoutine.behaviorAtHome === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                  selectedRoutine.behaviorAtHome === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                  selectedRoutine.behaviorAtHome === 'AVERAGE' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedRoutine.behaviorAtHome || 'N/A'}
                </span>
              </div>
            </div>
            
            {selectedRoutine.breakfastItems && (
              <div className="mt-4">
                <strong>Breakfast Items:</strong> {selectedRoutine.breakfastItems}
              </div>
            )}
            
            {selectedRoutine.lunchItems && (
              <div className="mt-2">
                <strong>Lunch Items:</strong> {selectedRoutine.lunchItems}
              </div>
            )}
            
            {selectedRoutine.dinnerItems && (
              <div className="mt-2">
                <strong>Dinner Items:</strong> {selectedRoutine.dinnerItems}
              </div>
            )}
            
            {selectedRoutine.beforeClassActivity && (
              <div className="mt-2">
                <strong>Before Class Activity:</strong> {selectedRoutine.beforeClassActivity}
              </div>
            )}
            
            {selectedRoutine.notes && (
              <div className="mt-2">
                <strong>Notes:</strong> {selectedRoutine.notes}
              </div>
            )}
            
            {selectedRoutine.adminFeedback && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <strong>Admin Feedback:</strong>
                <p className="mt-1">{selectedRoutine.adminFeedback}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By {selectedRoutine.feedbackBy?.username} on {new Date(selectedRoutine.feedbackDate).toLocaleDateString()}
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add feedback for this routine..."
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddFeedback}
                  disabled={submittingFeedback || !feedback.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submittingFeedback ? 'Saving...' : selectedRoutine.adminFeedback ? 'Update Feedback' : 'Add Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;