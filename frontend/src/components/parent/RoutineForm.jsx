import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { routineService } from '../../services/routineService';
import TimePicker from '../common/TimePicker';
import toast from 'react-hot-toast';

const RoutineForm = ({ student, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      routineDate: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const routineData = {
        ...data,
        studentId: student.id,
        screenTimeMinutes: data.screenTimeMinutes ? parseInt(data.screenTimeMinutes) : null,
        studyTimeMinutes: data.studyTimeMinutes ? parseInt(data.studyTimeMinutes) : null
      };
      
      await routineService.saveRoutine(routineData);
      onSave();
    } catch (error) {
      toast.error('Failed to save routine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Daily Routine for {student.name}
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register('routineDate', { required: 'Date is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.routineDate && (
              <p className="text-red-500 text-xs mt-1">{errors.routineDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wake Up Time
            </label>
            <TimePicker
              value={watch('wakeUpTime')}
              onChange={(value) => setValue('wakeUpTime', value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Time
            </label>
            <TimePicker
              value={watch('schoolTime')}
              onChange={(value) => setValue('schoolTime', value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breakfast Time
            </label>
            <TimePicker
              value={watch('breakfastTime')}
              onChange={(value) => setValue('breakfastTime', value)}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breakfast Items
            </label>
            <textarea
              {...register('breakfastItems')}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What did they eat for breakfast?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lunch Time
            </label>
            <TimePicker
              value={watch('lunchTime')}
              onChange={(value) => setValue('lunchTime', value)}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lunch Items
            </label>
            <textarea
              {...register('lunchItems')}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What did they eat for lunch?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screen Time (minutes)
            </label>
            <input
              type="number"
              {...register('screenTimeMinutes')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nap Time
            </label>
            <TimePicker
              value={watch('napTime')}
              onChange={(value) => setValue('napTime', value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Study Time (minutes)
            </label>
            <input
              type="number"
              {...register('studyTimeMinutes')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Before Class Activity
            </label>
            <textarea
              {...register('beforeClassActivity')}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What did they do before class?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dinner Time
            </label>
            <TimePicker
              value={watch('dinnerTime')}
              onChange={(value) => setValue('dinnerTime', value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep Time
            </label>
            <TimePicker
              value={watch('sleepTime')}
              onChange={(value) => setValue('sleepTime', value)}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dinner Items
            </label>
            <textarea
              {...register('dinnerItems')}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="What did they eat for dinner?"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Behavior at Home
            </label>
            <select
              {...register('behaviorAtHome')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select behavior</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="AVERAGE">Average</option>
              <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional notes about the day..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Routine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoutineForm;