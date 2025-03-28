import { Router } from "express";
import { addNewContact, fetchAllContacts, modifyExistingContact, removeContactById } from "../controller/contactOperations.js";


const router = Router();

// Define routes for contact operations
router.route("/add").post(addNewContact); // Add new contact
router.route("/all").get(fetchAllContacts); // Get all contacts
router.route("/update").put(modifyExistingContact); // Update contact
router.route("/delete").delete(removeContactById); // Delete contact

export default router;
