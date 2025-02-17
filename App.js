import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import CrudScreen from './src/screen/crudscreen'; // ✅ Import with capitalized name

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <CrudScreen />  {/* ✅ Correct component usage */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ Ensure full-screen layout
    backgroundColor: "#fff",
  },
});
