import mongoose, { Document, Schema } from 'mongoose';
import { use } from 'react';

export interface IReadmeElement extends Document {
  type: 'contribution' | 'stats' | 'languages' | 'streak' | 'repo' | 'trophies';
  subtype: string; 
  username: string;
  theme?: string;
  data: any; 
  markdown: string; 
  lastUpdated: Date;
  ttl?: number; 
}

const ReadmeElementSchema = new Schema<IReadmeElement>({
  type: { type: String, required: true, enum: ['contribution', 'stats', 'languages', 'streak', 'repo', 'trophies'] },
  subtype: { type: String, required: true },
  username: { type: String, required: true, index: true },
  theme: { type: String },
  data: { type: Schema.Types.Mixed, required: true },
  markdown: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now, index: true },
  ttl: { type: Number, default: 86400 }
}, {
  timestamps: true
});

ReadmeElementSchema.index({ type: 1, subtype: 1, username: 1, theme: 1 }, { unique: true });


const ReadmeElement = mongoose.model<IReadmeElement>('ReadmeElement', ReadmeElementSchema);

export default ReadmeElement;
