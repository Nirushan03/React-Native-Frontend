import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Fallback from "../components/Fallback";

// API endpoints
const API_URL = "http://192.168.170.165:5000/api/Products";
const IMAGE_BASE_URL = "http://192.168.170.165:5000/uploads/"; // Adjust based on your backend

const CrudScreen = () => {
  // State variables for product details
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [crudList, setCrudList] = useState([]);
  const [editCrud, setEditCrud] = useState(null);

  // Fetch items on component mount
  useEffect(() => {
    fetchCrudItems();
  }, []);

  // Fetch products from the server
  const fetchCrudItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setCrudList(response.data);
      console.log("Fetched data:", response.data); // Debugging
    } catch (error) {
      Alert.alert("Error", "Failed to load data from the server.");
    }
  };

  // Open image picker to select an image
  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Add or update a product
  const handleAddOrUpdateProduct = async () => {
    if (!name || !price || !quantity) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("price", parseFloat(price));
    formData.append("quantity", parseInt(quantity));

    if (image) {
      let fileName = image.split("/").pop();
      let fileType = fileName.split(".").pop();

      formData.append("image", {
        uri: image,
        type: `image/${fileType}`,
        name: fileName,
      });
    }

    try {
      const url = editCrud ? `${API_URL}/${editCrud._id}` : API_URL;
      const method = editCrud ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      fetchCrudItems(); // Refresh list
      setEditCrud(null);
      setName("");
      setPrice("");
      setQuantity("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "Failed to upload image or save data.");
    }
  };

  // Delete a product
  const handleDeleteCrud = async (_id) => {
    try {
      await axios.delete(`${API_URL}/${_id}`);
      setCrudList(crudList.filter((item) => item._id !== _id));
    } catch (error) {
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  // Populate form for editing
  const handleEditCrud = (item) => {
    setEditCrud(item);
    setName(item.name);
    setPrice(item.price.toString());
    setQuantity(item.quantity.toString());
    setImage(item.image ? `${IMAGE_BASE_URL}${item.image}` : null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bakery Shop</Text>

      {/* Input fields */}
      <TextInput style={styles.input} placeholder="Item name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Item price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Item quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />

      {/* Image selection */}
      <Text style={styles.imageLabel}>Choose Image</Text>
      <TouchableOpacity style={styles.imageButton} onPress={handleChooseImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.productImage} />}

      {/* Add/Update button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdateProduct}>
        <Text style={styles.buttonText}>{editCrud ? "Update" : "Add"}</Text>
      </TouchableOpacity>

      {/* Product list table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Image</Text>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Price</Text>
          <Text style={styles.headerText}>Quantity</Text>
          <Text style={styles.headerText}>Actions</Text>
        </View>

        <FlatList
          data={crudList}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Image source={{ uri: `${IMAGE_BASE_URL}${item.image}` }} style={styles.rowImage} />
              <Text style={styles.rowText}>{item.name}</Text>
              <Text style={styles.rowText}>Rs.{item.price}</Text>
              <Text style={styles.rowText}>{item.quantity}</Text>
              <View style={styles.actions}>
                <IconButton icon="pencil" iconColor="#fff" onPress={() => handleEditCrud(item)} style={[styles.iconButton, styles.iconEdit]} />
                <IconButton icon="trash-can" iconColor="#fff" onPress={() => handleDeleteCrud(item._id)} style={[styles.iconButton, styles.iconDelete]} />
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
        />

        {crudList.length === 0 && <Fallback />}
      </View>
    </View>
  );
};

export default CrudScreen;

// Styles omitted for brevity
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 40,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    color: "#388E3C",
    padding: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#1e90ff",
    borderRadius: 6,
    padding: 8,
    marginTop: 10,
    height: 40,
  },
  imageLabel: {
    fontSize: 16,
    marginTop: 20,
    color: "#333",
    fontWeight: "bold",
  },
  imageButton: {
    backgroundColor: "#008CBA", // Blue color for the image select button
    borderRadius: 6,
    padding: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#388E3C", // Green color for the Add button
    borderRadius: 6,
    padding: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: "center",
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#008CBA",
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 6,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  rowImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  rowText: {
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 6,
    padding: 6,
    borderRadius: 8,
    width: 30,
    height: 30,
  },
  iconEdit: {
    backgroundColor: "#4CAF50", // Green color for Edit button
  },
  iconDelete: {
    backgroundColor: "#F44336", // Red color for Delete button
  },
});
