import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

type Status = 'To Do' | 'In Progress' | 'Done';

type TaskData = {
  [key in Status]: string[];
};

const COLUMN_ORDER: Status[] = ['To Do', 'In Progress', 'Done'];
const COLUMN_WIDTH = 225;

const ProfileScreen: React.FC = () => {
  const [tasks, setTasks] = useState<TaskData>({
    'To Do': [
      'Task Customization',
      'Deadline Management',
      'Networking Assistance',
      'Data Security Assurance',
    ],
    'In Progress': [
      'Application Tracking',
      'Automated Job Alerts',
      'Mobile Optimization',
    ],
    Done: ['Continuous Feedback Loop'],
  });

  const [activeDropTarget, setActiveDropTarget] = useState<Status | null>(null);

  const moveTask = (task: string, from: Status, direction: number) => {
    const fromIndex = COLUMN_ORDER.indexOf(from);
    const toIndex = fromIndex + direction;

    if (toIndex < 0 || toIndex >= COLUMN_ORDER.length) return;

    const to = COLUMN_ORDER[toIndex];

    setTasks((prevTasks) => {
      const newFrom = prevTasks[from].filter((t) => t !== task);
      const newTo = [...prevTasks[to], task];
      return {
        ...prevTasks,
        [from]: newFrom,
        [to]: newTo,
      };
    });

    setActiveDropTarget(null);
  };

  const addTask = () => {
    const newTask = `New Task ${tasks['To Do'].length + 1}`;
    setTasks((prev) => ({
      ...prev,
      'To Do': [...prev['To Do'], newTask],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.projectTitle}>Website for Rune.io</Text>
      <TextInput placeholder="Search cards..." style={styles.searchInput} />

      <ScrollView horizontal contentContainerStyle={styles.scrollContent}>
        <View style={styles.board}>
          {COLUMN_ORDER.map((status) => (
            <View
              key={status}
              style={[
                styles.column,
                activeDropTarget === status && styles.highlightedColumn,
              ]}
            >
              <Text style={styles.columnHeader}>{status}</Text>
              {tasks[status].map((task) => (
                <TaskCard
                  key={task}
                  task={task}
                  fromStatus={status}
                  moveTask={moveTask}
                  setActiveDropTarget={setActiveDropTarget}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={addTask}>
         <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

type TaskCardProps = {
  task: string;
  fromStatus: Status;
  moveTask: (task: string, from: Status, direction: number) => void;
  setActiveDropTarget: (status: Status | null) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  fromStatus,
  moveTask,
  setActiveDropTarget,
}) => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    zIndex: translateX.value !== 0 ? 1 : 0,
  }));

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;

      const threshold = COLUMN_WIDTH / 2;
      if (event.translationX > threshold) {
        runOnJS(setActiveDropTarget)(COLUMN_ORDER[COLUMN_ORDER.indexOf(fromStatus) + 1]);
      } else if (event.translationX < -threshold) {
        runOnJS(setActiveDropTarget)(COLUMN_ORDER[COLUMN_ORDER.indexOf(fromStatus) - 1]);
      } else {
        runOnJS(setActiveDropTarget)(null);
      }
    },
    onEnd: (event) => {
      const threshold = COLUMN_WIDTH / 2;
      if (event.translationX > threshold) {
        runOnJS(moveTask)(task, fromStatus, 1);
      } else if (event.translationX < -threshold) {
        runOnJS(moveTask)(task, fromStatus, -1);
      }
      translateX.value = withSpring(0);
      runOnJS(setActiveDropTarget)(null);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[styles.taskCard, animatedStyle]}>
        <Text style={styles.taskText}>{task}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  projectTitle: { fontSize: 22, fontWeight: 'bold', margin: 20 },
  searchInput: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 100, // prevent button overlap
  },
  board: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  column: {
    width: COLUMN_WIDTH,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  highlightedColumn: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  columnHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskText: { fontWeight: '500' },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 70,
    backgroundColor: '#ff5f03',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ProfileScreen;
