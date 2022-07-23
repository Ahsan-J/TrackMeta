import { BaseModel } from "../../helper/model";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Artist extends BaseModel {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;
    
    @Column()
    spotify_url: string;

    @Column()
    uri: string;
}