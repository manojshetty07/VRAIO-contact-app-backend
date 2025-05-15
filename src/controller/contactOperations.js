


import { sequelize } from "../db/databaseConnection.js";
import { Contacts } from "../models/index.js";
import { CustomError } from "../utils/errorHandler.js";
import { SuccessResponse } from "../utils/responseHandler.js";

// Fetch all contacts
const fetchAllContacts = async (_, res) => {
  try {
    const contacts = await Contacts.findAll({
      attributes: {
        include: [
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("dob"), "%Y-%m-%d"),
            "dob",
          ],
        ],
        exclude: ["dob"],
      },
    });

    const formattedContacts = contacts.map((con) => ({
      contactId: con.contactId,
      firstName: con.firstName,
      lastName: con.lastName,
      nickName: con.nickName,
      dob: con.dob,
      phoneNumbers: con.phoneNumbers ? JSON.parse(con.phoneNumbers) : [],
      emails: con.emails ? JSON.parse(con.emails) : [],
    }));
    return res
      .status(200)
      .json(
        new SuccessResponse(
          200,
          formattedContacts,
          "Contacts retrieved successfully"
        )
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new CustomError(500, error.message));
  }
};

// Add a new contact
const addNewContact = async (req, res) => {
  const { contactData } = req.body;

  try {
    const con = await Contacts.create({
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      nickName: contactData.nickName,
      dob: contactData.dob,
      phoneNumbers: contactData.phoneNumbers,
      emails: contactData.emails,
    });

    

    return res
      .status(200)
      .json(
        new SuccessResponse(
          200,
          { contactId: con.contactId },
          "Contact added successfully"
        )
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new CustomError(500, error.message));
  }
};

// Update an existing contact
const modifyExistingContact = async (req, res) => {
  const { contactData } = req.body;

  try {
    const con = await Contacts.findByPk(contactData.contactId);

    con.update({
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      nickName: contactData.nickName,
      dob: contactData.dob,
      phoneNumbers: contactData.phoneNumbers,
      emails: contactData.emails,
    });


    return res
      .status(200)
      .json(
        new SuccessResponse(
          200,
          { contactId: contactData.contactId },
          "Contact updated successfully"
        )
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new CustomError(500, error.message));
  }
};

// Delete a contact
const removeContactById = async (req, res) => {
  const { contactId } = req.query;

  try {
    await Contacts.destroy({
      where: {
        contactId: contactId,
      },
    });

    return res
      .status(200)
      .json(
        new SuccessResponse(200, { contactId }, "Contact deleted successfully")
      );
  } catch (error) {
    return res.status(500).json(new CustomError(500, error.message));
  }
};

export {
  fetchAllContacts,
  addNewContact,
  modifyExistingContact,
  removeContactById,
};
