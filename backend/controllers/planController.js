import { readData, writeData } from '../utils/storage.js';

export const getPlan = (req, res) => {
  try {
    const plans = readData('plans.json');
    const userPlan = plans.find(p => p.email === req.user.email);

    if (!userPlan) return res.json({ plan: [] });

    res.json({ plan: userPlan.workouts });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPlan = (req, res) => {
  try {
    const { height, weight, goal } = req.body;

    if (!height || !weight || !goal) {
      return res.status(400).json({ error: 'Missing profile information' });
    }

    const bmi = weight / (height * height);
    let intensity;
    if (bmi < 18.5) {
      intensity = goal === 'bulking' ? 'Medium' : 'Low';
    } else if (bmi < 25) {
      intensity = 'Medium';
    } else {
      intensity = goal === 'cutting' ? 'High' : 'Medium';
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const exercises = {
      strength: [
        { name: 'Push-ups', reps: '3x12' },
        { name: 'Squats', reps: '3x15' },
        { name: 'Lunges', reps: '3x10 each leg' },
        { name: 'Plank', reps: '3x30 seconds' },
        { name: 'Mountain Climbers', reps: '3x20' },
        { name: 'Burpees', reps: '3x10' },
        { name: 'Tricep Dips', reps: '3x12' },
        { name: 'Glute Bridges', reps: '3x15' }
      ],
      cardio: [
        { name: 'Jumping Jacks', reps: '4x30 seconds' },
        { name: 'High Knees', reps: '4x30 seconds' },
        { name: 'Skipping', reps: '5 minutes' },
        { name: 'Burpees', reps: '3x8' }
      ],
      yoga: [
        { name: 'Downward Dog', reps: '30 seconds' },
        { name: 'Warrior Pose', reps: '30 seconds each side' },
        { name: 'Chair Pose', reps: '30 seconds' },
        { name: 'Tree Pose', reps: '30 seconds each leg' }
      ],
      meditation: [
        { name: 'Deep Breathing', reps: '5 minutes' },
        { name: 'Body Scan', reps: '10 minutes' }
      ]
    };

    const workouts = days.map((day, index) => {
      if (index === 6) {
        return {
          day,
          title: 'Rest & Recovery',
          duration: '15 minutes',
          intensity: 'Low',
          exercises: [
            { name: 'Light Stretching', reps: '10 minutes' },
            { name: 'Meditation', reps: '5 minutes' }
          ],
          isCompleted: false
        };
      }

      let workoutType, durationMinutes, exerciseList;
      if (index % 3 === 0) {
        workoutType = 'Full Body';
        durationMinutes = intensity === 'High' ? 45 : intensity === 'Medium' ? 35 : 25;
        exerciseList = [...exercises.strength.slice(0, 4), ...exercises.cardio.slice(0, 2)];
      } else if (index % 3 === 1) {
        workoutType = goal === 'bulking' ? 'Upper Body Focus' : 'Cardio Blast';
        durationMinutes = intensity === 'High' ? 40 : intensity === 'Medium' ? 30 : 20;
        exerciseList = goal === 'bulking'
          ? [...exercises.strength.slice(0, 3), ...exercises.strength.slice(5, 7)]
          : [...exercises.cardio, ...exercises.strength.slice(4, 6)];
      } else {
        workoutType = goal === 'cutting' ? 'HIIT Session' : 'Core & Flexibility';
        durationMinutes = intensity === 'High' ? 35 : intensity === 'Medium' ? 25 : 15;
        exerciseList = goal === 'cutting'
          ? [...exercises.cardio.slice(0, 3), ...exercises.strength.slice(4, 6)]
          : [...exercises.strength.slice(3, 5), ...exercises.yoga.slice(0, 2)];
      }

      return {
        day,
        title: workoutType,
        duration: `${durationMinutes} minutes`,
        intensity,
        exercises: exerciseList,
        isCompleted: false
      };
    });

    const plans = readData('plans.json');
    const planIndex = plans.findIndex(p => p.email === req.user.email);

    if (planIndex === -1) {
      plans.push({ email: req.user.email, workouts });
    } else {
      plans[planIndex].workouts = workouts;
    }

    writeData('plans.json', plans);

    res.json({ plan: workouts });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
