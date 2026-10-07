import { Request, Response } from 'express';
import { pool } from '../conf/dbConnection';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE active = TRUE');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? AND active = TRUE', [id]);
    
    if (rows.length === 0) {
      res.status(404).json({ message: 'Product not found or inactive' });
      return;
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, stock, description, brand, img, active = true } = req.body;
    
    const [result]: any = await pool.query(
      'INSERT INTO products (name, price, stock, description, brand, img, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, price, stock, description, brand, img, active]
    );
    
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const updateProductPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    if (price === undefined) {
      res.status(400).json({ message: 'Price is required' });
      return;
    }

    const [result]: any = await pool.query(
      'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
      [price, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found or inactive' });
      return;
    }

    res.json({ message: 'Product price updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product price', error });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Logically delete product by setting active to FALSE
    const [result]: any = await pool.query(
      'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found or already inactive' });
      return;
    }

    res.json({ message: 'Product logically deleted (deactivated)' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
