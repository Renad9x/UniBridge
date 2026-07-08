// for change Information in Teacher Profile Screen
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const UpdateProfileT = () => {

  const [AcademicRank, setAcademicRank] = useState("");
  const [Professionaldesignation, setProfessionaldesignation] = useState("");
  const [AcademicSpecialization, setAcademicSpecialization] = useState("");
  const [Workplace, setWorkplace] = useState("");
  const [Email, setEmail] = useState("");

  const [CV, setCV] = useState("");
  const [Courses, setCourses] = useState("");
  const [Publications, setPublications] = useState("");
  const [Expertise, setExpertise] = useState("");

  const [officeHours, setOfficeHours] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [officeNumber, setOfficeNumber] = useState("");

  const navigation = useNavigation();

  const handleUpdate = async () => {
    const userDoc = doc(db, "users", auth.currentUser?.uid);
    await updateDoc(userDoc, {

      AcademicRank,
      Professionaldesignation,
      AcademicSpecialization,
      Workplace,
      Email,

      CV,
      Expertise,
      Publications,
      Courses,

      officeHours,
      officePhone,
      officeNumber,
    });
    navigation.goBack();
  };
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Edit Profile</Text>

      <Text style={styles.TStyle}>Academic Rank</Text>
      <TextInput
        placeholder="Enter your Academic Rank"
        value={AcademicRank}
        onChangeText={setAcademicRank}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Professional designation</Text>
      <TextInput
        placeholder="Enter your Professional designation"
        value={Professionaldesignation}
        onChangeText={setProfessionaldesignation}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Academic Specialization</Text>
      <TextInput
        placeholder="Enter your Academic Specialization"
        value={AcademicSpecialization}
        onChangeText={setAcademicSpecialization}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Workplace</Text>
      <TextInput
        placeholder="Enter your Workplace"
        value={Workplace}
        onChangeText={setWorkplace}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Email</Text>
      <TextInput
        placeholder="Enter your Email"
        value={Email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Introduction/Brief CV</Text>
      <TextInput
        placeholder="Enter your Introduction/Brief CV"
        value={CV}
        onChangeText={setCV}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Areas Of Expertise</Text>
      <TextInput
        placeholder="Enter your Expertise"
        value={Expertise}
        onChangeText={setExpertise}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Publications</Text>
      <TextInput
        placeholder="Enter your Publications"
        value={Publications}
        onChangeText={setPublications}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Courses</Text>
      <TextInput
        placeholder="Enter your Courses"
        value={Courses}
        onChangeText={setCourses}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Office Hours</Text>
      <TextInput
        placeholder="Enter your Office Hours"
        value={officeHours}
        onChangeText={setOfficeHours}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Office Phone</Text>
      <TextInput
        placeholder="Enter your Office Phone"
        value={officePhone}
        onChangeText={setOfficePhone}
        style={styles.input}
      />

      <Text style={styles.TStyle}>Office Number</Text>
      <TextInput
        placeholder="Enter your Office Number"
        value={officeNumber}
        onChangeText={setOfficeNumber}
        style={styles.input}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {/* Sign out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UpdateProfileT;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  TStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#a0afc7",
    marginBottom: 5,
    paddingTop: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    fontSize: 15,
  },
  saveButton: {
    height: 50,
    backgroundColor: "#1B3C87",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
