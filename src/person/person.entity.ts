import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, unique: false })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ name: 'is_married', default: false })
  isMarried!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}