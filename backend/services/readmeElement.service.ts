import { Types } from 'mongoose';
import ReadmeElement, { IReadmeElement } from '../models/ReadmeElement';

export interface ReadmeElementData {
  type: IReadmeElement['type'];
  subtype: string;
  username: string;
  theme?: string;
  data: any;
  markdown: string;
  ttl?: number;
}

class ReadmeElementService {
  /**
   * Get a README element from cache or create a new one
   */
  async getOrCreateElement(elementData: ReadmeElementData): Promise<IReadmeElement> {
    const { type, subtype, username, theme, data, markdown, ttl } = elementData;
    
    // Try to find existing element
    const query: any = { type, subtype, username };
    if (theme) query.theme = theme;
    
    const existingElement = await ReadmeElement.findOne(query);
    
    // If exists and not expired, return it
    if (existingElement) {
      const now = new Date();
      const lastUpdated = existingElement.lastUpdated;
      const cacheDuration = (now.getTime() - lastUpdated.getTime()) / 1000; // in seconds
      
      if (cacheDuration < (existingElement.ttl || 86400)) {
        return existingElement;
      }
    }
    
    // Otherwise, create or update the element
    const updateData = {
      ...elementData,
      lastUpdated: new Date(),
      ttl: ttl || 86400 // Default 24 hours
    };
    
    return ReadmeElement.findOneAndUpdate(
      query,
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }
  
  /**
   * Get a README element by ID
   */
  async getElementById(id: string): Promise<IReadmeElement | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ReadmeElement.findById(id);
  }
  
  /**
   * Get all elements for a user
   */
  async getUserElements(username: string): Promise<IReadmeElement[]> {
    return ReadmeElement.find({ username }).sort({ type: 1, subtype: 1 });
  }
  
  /**
   * Delete an element by ID
   */
  async deleteElement(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await ReadmeElement.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
  
  /**
   * Clear cache for a specific user and element type
   */
  async clearCache(username: string, type?: string, subtype?: string): Promise<number> {
    const query: any = { username };
    if (type) query.type = type;
    if (subtype) query.subtype = subtype;
    
    const result = await ReadmeElement.deleteMany(query);
    return result.deletedCount || 0;
  }
}

export default new ReadmeElementService();
