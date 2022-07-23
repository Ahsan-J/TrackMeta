import { BaseModel } from "../../helper/model";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Track } from "./track.entity";

@Entity()
export class Images extends BaseModel {
    @PrimaryColumn()
    src: string;

    @Column()
    width: number;
    
    @Column()
    height: number;

    @ManyToOne(() => Track, meta => meta.images)
    meta: Track;
}