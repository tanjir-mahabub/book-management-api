import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from '../../../modules/authors/entities/author.entity';

@Entity()
@Unique(['isbn'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  isbn: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: string;

  @Column({ nullable: true })
  genre?: string;

  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'RESTRICT', eager: true })
  author: Author;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
