// import { dbPool } from "../db/databaseConnection.js";
// import { CustomError } from "../utils/errorHandler.js";
// import { SuccessResponse } from "../utils/responseHandler.js";
// import {dbPool} from "../db/databaseConnection.js";
// import {CustomError} from "../utils/errorHandler.js"
// import {SuccessResponse} from "../utils/responseHandler.js"

import { dbPool } from "../db/databaseConnection.js";
import { CustomError } from "../utils/errorHandler.js";
import { SuccessResponse } from "../utils/responseHandler.js";

// Fetch all contacts
const fetchAllContacts = async (_, res) => {
  try {
    const connection = await dbPool.getConnection();
    const query = `
      SELECT 
        c.contact_id AS contactId, 
        c.first_name AS firstName, 
        c.last_name AS lastName, 
        c.nick_name AS nickName, 
        DATE_FORMAT(c.dob, '%Y-%m-%d') AS dob, 
        COALESCE(GROUP_CONCAT(DISTINCT p.phone_number ORDER BY p.id SEPARATOR ','), '') AS phoneNumbers,
        COALESCE(GROUP_CONCAT(DISTINCT e.email ORDER BY e.id SEPARATOR ','), '') AS emails
      FROM contacts c
      LEFT JOIN phone_number p ON c.contact_id = p.contact_id
      LEFT JOIN email e ON c.contact_id = e.contact_id
      GROUP BY c.contact_id;
    `;
    const [contacts] = await connection.query(query);
    connection.release();

    const formattedContacts = contacts.map((contact) => {
      contact.phoneNumbers = contact.phoneNumbers.split(",").map(Number);
      contact.emails = contact.emails.split(",");
      return contact;
    });

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
    const connection = await dbPool.getConnection();

    const insertContactQuery = `INSERT INTO contacts(first_name, last_name, nick_name, dob) VALUES (?, ?, ?, ?)`;
    const contactValues = [
      contactData.firstName,
      contactData.lastName,
      contactData.nickName,
      contactData.dob,
    ];
    const result = await connection.query(insertContactQuery, contactValues);

    const insertPhoneQuery = `INSERT INTO phone_number(contact_id, phone_number) VALUES(?, ?)`;
    await Promise.all(
      contactData.phoneNumbers.map((phone) =>
        connection.query(insertPhoneQuery, [result[0].insertId, phone])
      )
    );

    const insertEmailQuery = `INSERT INTO email(contact_id, email) VALUES(?, ?)`;
    await Promise.all(
      contactData.emails.map((email) =>
        connection.query(insertEmailQuery, [result[0].insertId, email])
      )
    );

    connection.release();

    return res
      .status(200)
      .json(
        new SuccessResponse(
          200,
          { contactId: result[0].insertId },
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
    const connection = await dbPool.getConnection();

    const updateContactQuery = `
      UPDATE contacts 
      SET first_name = ?, last_name = ?, nick_name = ?, dob = ?
      WHERE contact_id = ?`;
    const updateValues = [
      contactData.firstName,
      contactData.lastName,
      contactData.nickName,
      contactData.dob,
      contactData.contactId,
    ];
    await connection.query(updateContactQuery, updateValues);

    await connection.query(`DELETE FROM phone_number WHERE contact_id = ?`, [
      contactData.contactId,
    ]);
    await connection.query(`DELETE FROM email WHERE contact_id = ?`, [
      contactData.contactId,
    ]);

    const insertPhoneQuery = `INSERT INTO phone_number(contact_id, phone_number) VALUES(?, ?)`;
    await Promise.all(
      contactData.phoneNumbers.map((phone) =>
        connection.query(insertPhoneQuery, [contactData.contactId, phone])
      )
    );

    const insertEmailQuery = `INSERT INTO email(contact_id, email) VALUES(?, ?)`;
    await Promise.all(
      contactData.emails.map((email) =>
        connection.query(insertEmailQuery, [contactData.contactId, email])
      )
    );

    connection.release();

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
    const connection = await dbPool.getConnection();
    await connection.query(`DELETE FROM contacts WHERE contact_id = ?`, [
      contactId,
    ]);
    connection.release();

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
