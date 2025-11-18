// Firestore Database Service Layer
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin').firestore;

/**
 * Generic Firestore service for CRUD operations
 */
class FirestoreService {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @param {string} id - Optional document ID
   * @returns {Promise<Object>} Created document with ID
   */
  async create(data, id = null) {
    try {
      const timestamp = FieldValue.serverTimestamp();
      const docData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      if (id) {
        await this.collection.doc(id).set(docData);
        return { id, ...docData };
      } else {
        const docRef = await this.collection.add(docData);
        return { id: docRef.id, ...docData };
      }
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  /**
   * Find a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object|null>} Document data or null
   */
  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  /**
   * Find documents by field value
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @returns {Promise<Array>} Array of documents
   */
  async findByField(field, value) {
    try {
      const snapshot = await this.collection.where(field, '==', value).get();
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  /**
   * Find one document by field value
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @returns {Promise<Object|null>} Document or null
   */
  async findOneByField(field, value) {
    try {
      const docs = await this.findByField(field, value);
      return docs.length > 0 ? docs[0] : null;
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  /**
   * Get all documents in collection
   * @param {Object} options - Query options (limit, orderBy, etc.)
   * @returns {Promise<Array>} Array of documents
   */
  async findAll(options = {}) {
    try {
      let query = this.collection;

      if (options.orderBy) {
        query = query.orderBy(options.orderBy.field, options.orderBy.direction || 'asc');
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.where) {
        options.where.forEach(condition => {
          query = query.where(condition.field, condition.operator, condition.value);
        });
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error getting all documents: ${error.message}`);
    }
  }

  /**
   * Update a document by ID
   * @param {string} id - Document ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated document
   */
  async update(id, data) {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Document not found');
      }

      const updateData = {
        ...data,
        updatedAt: FieldValue.serverTimestamp()
      };

      await docRef.update(updateData);
      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  /**
   * Delete a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  /**
   * Count documents in collection
   * @param {Object} where - Optional where clause
   * @returns {Promise<number>} Document count
   */
  async count(where = null) {
    try {
      let query = this.collection;

      if (where) {
        query = query.where(where.field, where.operator, where.value);
      }

      const snapshot = await query.get();
      return snapshot.size;
    } catch (error) {
      throw new Error(`Error counting documents: ${error.message}`);
    }
  }
}

module.exports = FirestoreService;
