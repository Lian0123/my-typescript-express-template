import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";

@Entity()
export class ChatRoomEEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}