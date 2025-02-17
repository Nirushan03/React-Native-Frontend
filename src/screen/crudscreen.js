import {FlatList,StyleSheet,Text,TextInput,TouchableOpacity,View,Alert} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton } from "react-native-paper";
import Fallback from "../components/Fallback"; //  Ensure correct import

const API_URL = "http://192.168.120.165:5000/api/Products"; // Replace with your actual backend URL

const CrudScreen = () => {
  // Initialize local states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [crudList, setCrudList] = useState([]);
  const [editCrud, setEditCrud] = useState(null);

  // Fetch CRUD items on component mount
  useEffect(() => {
    fetchCrudItems();
  }, []);

  const fetchCrudItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setCrudList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load data from the server.");
    }
  };

  // Handle Add CRUD Item
  const handleAddCrud = async () => {
    if (!name || !price || !quantity) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    const newItem = { name: name, price, quantity };

    try {
      const response = await axios.post(API_URL, newItem);
      setCrudList([...crudList, response.data]);
      setName("");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Failed to add item.");
    }
  };

  // Handle Delete CRUD Item
  const handleDeleteCrud = async (_id) => {
    try {
      await axios.delete(`${API_URL}/${_id}`);
      setCrudList(crudList.filter((item) => item._id !== _id));
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  // Handle Edit CRUD Item
  const handleEditCrud = (item) => {
    setEditCrud(item);
    setName(item.name);
    setPrice(item.price.toString());
    setQuantity(item.quantity.toString());
  };

  // Handle Update CRUD Item
  const handleUpdateCrud = async () => {
    if (!editCrud) return;

    const updatedItem = { name: name, price, quantity };

    try {
      await axios.put(`${API_URL}/${editCrud._id}`, updatedItem);
      setCrudList(
        crudList.map((item) =>
          item._id === editCrud._id ? { ...item, ...updatedItem } : item
        )
      );
      setEditCrud(null);
      setName("");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Failed to update item.");
    }
  };

  // Render CRUD Item
  const renderCRUD = ({ item }) => {
    return (
      <View style={styles.crudItem}>
        <View style={styles.itemDetails}>
          <Text style={styles.crudText}>Item Name: {item.name}</Text>
          <Text style={styles.crudText}>Price: Rs.{item.price}</Text>
          <Text style={styles.crudText}>Quantity: {item.quantity}</Text>
        </View>
        <IconButton icon="pencil" iconColor="#fff" onPress={() => handleEditCrud(item)} />
        <IconButton icon="trash-can" iconColor="#fff" onPress={() => handleDeleteCrud(item._id)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Item name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Item price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Item quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {editCrud ? (
        <TouchableOpacity style={styles.button} onPress={handleUpdateCrud}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddCrud}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      )}

      {/* Render CRUD List */}
      <FlatList
        data={crudList}
        renderItem={renderCRUD}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Fixed issue
      />

      {/* Show fallback message when list is empty */}
      {crudList.length === 0 && <Fallback />}
    </View>
  );
};

export default CrudScreen;

// Fixed styles with no syntax errors
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 70,
  },
  input: {
    borderWidth: 2,
    borderColor: "#1e90ff",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 6,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  crudItem: {
    backgroundColor: "#1e90ff",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  itemDetails: {
    flex: 1,
  },
  crudText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
