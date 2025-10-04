import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (e) {
      Alert.alert('Error', 'Failed to save tasks');
    }
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  const addOrEditTask = () => {
    if (!title.trim()) return Alert.alert('Missing Title', 'Please enter a task title.');

    const task = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title,
      desc,
      priority,
      dueDate: dueDate.toISOString(),
      completed: editingTask ? editingTask.completed : false,
    };

    const updatedTasks = editingTask
      ? tasks.map((t) => (t.id === editingTask.id ? task : t))
      : [...tasks, task];

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setPriority('Low');
    setDueDate(new Date());
    setEditingTask(null);
    setModalVisible(false);
  };

  const deleteTask = (id) => {
    const filtered = tasks.filter((t) => t.id !== id);
    setTasks(filtered);
    saveTasks(filtered);
  };

  const toggleComplete = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  const openEditModal = (task) => {
    setTitle(task.title);
    setDesc(task.desc);
    setPriority(task.priority);
    setDueDate(new Date(task.dueDate));
    setEditingTask(task);
    setModalVisible(true);
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={[styles.task, item.completed && styles.completedTask]}
      onPress={() => toggleComplete(item.id)}
      onLongPress={() =>
        Alert.alert('Options', '', [
          { text: 'Edit', onPress: () => openEditModal(item) },
          { text: 'Delete', onPress: () => deleteTask(item.id), style: 'destructive' },
          { text: 'Cancel', style: 'cancel' },
        ])
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
          {item.title}
        </Text>
        {item.desc ? <Text style={styles.taskDesc}>{item.desc}</Text> : null}
        <Text style={styles.taskMeta}>
          Priority: {item.priority} | Due: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.checkmark}>{item.completed ? '✓' : ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 To-Do List</Text>

      <FlatList
        data={tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet!</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'New Task'}
            </Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={desc}
              onChangeText={setDesc}
              style={[styles.input, { height: 60 }]}
              multiline
            />

            <TextInput
              placeholder="Priority (Low, Medium, High)"
              value={priority}
              onChangeText={setPriority}
              style={styles.input}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePicker}>
                Due Date: {dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setDueDate(date);
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={addOrEditTask} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  {editingTask ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  task: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: { fontSize: 18, fontWeight: '600' },
  taskDesc: { fontSize: 14, color: '#666' },
  taskMeta: { fontSize: 12, color: '#888', marginTop: 4 },
  completedTask: { backgroundColor: '#d3ffd3' },
  completedText: { textDecorationLine: 'line-through', color: '#888' },
  checkmark: { fontSize: 20, color: 'green', marginLeft: 10 },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3b82f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  addButtonText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  datePicker: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 10,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#333', fontWeight: 'bold' },
});

