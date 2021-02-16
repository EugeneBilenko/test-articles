import { IArticle } from '@interfaces/models/Article';
import mongoose from '../Database';

export interface IArticleModel extends IArticle, mongoose.Document {
  comparePassword(password: string): Promise<boolean>;
}

export const ArticleSchema = new mongoose.Schema<IArticleModel>({
  title: { type: String },
  text: { type: String },
  mainImage: { type: String },
  images: [ { type: String } ],
}, {
  timestamps: true,
});

const Article = mongoose.model<IArticleModel>('Article', ArticleSchema);

export default Article;
