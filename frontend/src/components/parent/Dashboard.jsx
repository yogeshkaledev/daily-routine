import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { routineService } from '../../services/routineService';
import RoutineForm from './RoutineForm';
import toast from 'react-hot-toast';

const ParentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadRoutines();
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
      if (data.length > 0) {
        setSelectedStudent(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load students');
    }
  };

  const loadRoutines = async () => {
    if (!selectedStudent) return;
    try {
      const data = await routineService.getRoutinesByStudent(selectedStudent.id);
      setRoutines(data);
    } catch (error) {
      toast.error('Failed to load routines');
    }
  };

  const handleRoutineSaved = () => {
    setShowForm(false);
    loadRoutines();
    toast.success('Routine saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Parent Dashboard</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Today's Routine
          </button>
        </div>

        {students.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child
            </label>
            <select
              value={selectedStudent?.id || ''}
              onChange={(e) => {
                const student = students.find(s => s.id === parseInt(e.target.value));
                setSelectedStudent(student);
              }}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.classGrade}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedStudent.name}'s Routine History
          </h3>
          
          {routines.length === 0 ? (
            <p className="text-gray-500">No routines recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {routines.map((routine) => (
                <div key={routine.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {new Date(routine.routineDate).toLocaleDateString()}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        routine.behaviorAtHome === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                        routine.behaviorAtHome === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                        routine.behaviorAtHome === 'AVERAGE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {routine.behaviorAtHome}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedRoutine(routine);
                          setShowModal(true);
                        }}
                        className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Wake Up:</span> {routine.wakeUpTime || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">School:</span> {routine.schoolTime || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Sleep:</span> {routine.sleepTime || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Screen Time:</span> {routine.screenTimeMinutes || 0} min
                    </div>
                  </div>
                  
                  {routine.notes && (
                    <div className="mt-2">
                      <span className="font-medium">Notes:</span> {routine.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && selectedStudent && (
        <RoutineForm
          student={selectedStudent}
          onSave={handleRoutineSaved}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Routine Details Modal */}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;