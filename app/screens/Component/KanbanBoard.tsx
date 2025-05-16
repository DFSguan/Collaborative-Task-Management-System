// KanbanBoard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

type Status = 'On going' | 'In Progress' | 'Done';

type TaskData = {
  [key in Status]: string[];
};

type KanbanBoardProps = {
  tasks: TaskData;
  setTasks: React.Dispatch<React.SetStateAction<TaskData>>;
};

const COLUMN_ORDER: Status[] = ['On going', 'In Progress', 'Done'];
const STATUS_COLORS: Record<Status, string> = {
        'On going': '#5f9ede',   
        'In Progress': '#f6b63e',
        'Done': '#1cc8b7',
};
const COLUMN_WIDTH = 225;

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, setTasks }) => {
  const [activeDropTarget, setActiveDropTarget] = React.useState<Status | null>(null);

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

  return (
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
            <View style={[styles.columnHeaderBox, { backgroundColor: STATUS_COLORS[status] }]}>
                <Text style={styles.columnHeaderText}>{status}</Text>
                <View style={styles.taskCountBadge}>
                    <Text style={styles.taskCountText}>{tasks[status].length}</Text>
                </View>
            </View>
            
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
         {/* Header: Title and Due Date */}

          <Text style={styles.taskText}>{task}</Text>
          <Text style={styles.dueDateText}>Due: 20 May</Text>
          <Text style={styles.commentText}>💬 3 Comments</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
    scrollContent: {
      paddingBottom: 100,
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
    columnHeaderBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    columnHeaderText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000',
      marginRight: 10,
    },
    taskCountBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    taskCountText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000',
    },
    taskCard: {
      backgroundColor: '#ffffff',
      paddingVertical: 16,
      paddingHorizontal: 14,
      borderRadius: 12,
      marginBottom: 12,
      alignItems: 'flex-start',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    taskText: {
      fontWeight: '600',
      fontSize: 14,
      flexShrink: 1,
      color: '#333',
    },

    dueDateText: {
      fontSize: 11,
      color: '#888',
      fontWeight: '500',
      marginTop: 6,
    },

    commentText: {
      fontSize: 11,
      color: '#555',
      marginTop: 4,
    },

});

export default KanbanBoard;