import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ type: "date", nullable: true })
  birthDate?: Date;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "varchar", default: "user" })
  role!: "user" | "admin";

  @Column({ default: true })
  isActive!: boolean;
}